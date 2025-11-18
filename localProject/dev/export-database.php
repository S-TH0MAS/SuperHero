#!/usr/bin/env php
<?php
/**
 * Script d'export de la base de données SQLite vers CSV
 * 
 * Usage: php export-database.php
 * 
 * Ce script exporte toutes les tables de la base de données SQLite
 * vers des fichiers CSV dans le dossier data/
 */

// Chemin vers la base de données Symfony
$symfonyRoot = dirname(__DIR__, 2);
$dbPath = $symfonyRoot . '/var/data_dev.db';
$outputDir = __DIR__ . '/data';

// Vérifier que la base de données existe
if (!file_exists($dbPath)) {
    echo "❌ Erreur: La base de données n'existe pas: $dbPath\n";
    echo "💡 Assurez-vous d'avoir exécuté les migrations et fixtures.\n";
    exit(1);
}

// Créer le dossier data s'il n'existe pas
if (!is_dir($outputDir)) {
    mkdir($outputDir, 0755, true);
    echo "📁 Dossier créé: $outputDir\n";
}

// Connexion à la base de données SQLite
try {
    $pdo = new PDO('sqlite:' . $dbPath);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "✅ Connexion à la base de données réussie\n";
} catch (PDOException $e) {
    echo "❌ Erreur de connexion: " . $e->getMessage() . "\n";
    exit(1);
}

/**
 * Fonction pour exporter une table en CSV
 */
function exportTableToCsv(PDO $pdo, string $tableName, string $outputFile): bool
{
    try {
        // Récupérer toutes les données de la table
        $stmt = $pdo->query("SELECT * FROM $tableName");
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        if (empty($rows)) {
            echo "⚠️  Table '$tableName' est vide, création d'un fichier CSV vide\n";
            // Créer un fichier avec juste les headers
            $stmt = $pdo->query("PRAGMA table_info($tableName)");
            $columns = $stmt->fetchAll(PDO::FETCH_ASSOC);
            $headers = array_column($columns, 'name');
            
            $file = fopen($outputFile, 'w');
            if ($file === false) {
                return false;
            }
            
            // Ajouter BOM UTF-8 pour Excel
            fwrite($file, "\xEF\xBB\xBF");
            fputcsv($file, $headers);
            fclose($file);
            return true;
        }
        
        // Ouvrir le fichier en écriture
        $file = fopen($outputFile, 'w');
        if ($file === false) {
            echo "❌ Impossible d'ouvrir le fichier: $outputFile\n";
            return false;
        }
        
        // Ajouter BOM UTF-8 pour Excel
        fwrite($file, "\xEF\xBB\xBF");
        
        // Écrire les en-têtes (noms des colonnes)
        $headers = array_keys($rows[0]);
        fputcsv($file, $headers);
        
        // Écrire les données
        foreach ($rows as $row) {
            // Convertir les valeurs NULL en chaîne vide
            $row = array_map(function($value) {
                return $value === null ? '' : $value;
            }, $row);
            fputcsv($file, $row);
        }
        
        fclose($file);
        return true;
    } catch (PDOException $e) {
        echo "❌ Erreur lors de l'export de '$tableName': " . $e->getMessage() . "\n";
        return false;
    }
}

/**
 * Fonction pour obtenir toutes les tables de la base de données
 */
function getTables(PDO $pdo): array
{
    $stmt = $pdo->query("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
    return $stmt->fetchAll(PDO::FETCH_COLUMN);
}

echo "\n📊 Début de l'export de la base de données...\n\n";

// Récupérer toutes les tables
$tables = getTables($pdo);

if (empty($tables)) {
    echo "⚠️  Aucune table trouvée dans la base de données\n";
    exit(0);
}

echo "📋 Tables trouvées: " . implode(', ', $tables) . "\n\n";

$exported = 0;
$failed = 0;

// Exporter chaque table
foreach ($tables as $table) {
    $outputFile = $outputDir . '/' . $table . '.csv';
    
    echo "📤 Export de '$table'... ";
    
    if (exportTableToCsv($pdo, $table, $outputFile)) {
        // Compter le nombre de lignes
        $lineCount = 0;
        if (($handle = fopen($outputFile, 'r')) !== false) {
            while (fgets($handle) !== false) {
                $lineCount++;
            }
            fclose($handle);
        }
        $dataRows = max(0, $lineCount - 1); // -1 pour l'en-tête
        
        echo "✅ ($dataRows lignes)\n";
        $exported++;
    } else {
        echo "❌\n";
        $failed++;
    }
}

echo "\n";
echo "═══════════════════════════════════════\n";
echo "📊 Résumé de l'export:\n";
echo "   ✅ Tables exportées: $exported\n";
if ($failed > 0) {
    echo "   ❌ Échecs: $failed\n";
}
echo "   📁 Dossier: $outputDir\n";
echo "═══════════════════════════════════════\n";
echo "\n✅ Export terminé!\n";


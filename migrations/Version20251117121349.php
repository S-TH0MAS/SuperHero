<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20251117121349 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE mission (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, assigned_team_id INTEGER DEFAULT NULL, title VARCHAR(255) NOT NULL, description CLOB NOT NULL, status VARCHAR(50) NOT NULL, start_at DATETIME NOT NULL, end_at DATETIME DEFAULT NULL, location VARCHAR(255) NOT NULL, danger_level INTEGER NOT NULL, CONSTRAINT FK_9067F23C23F46021 FOREIGN KEY (assigned_team_id) REFERENCES team (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_9067F23C23F46021 ON mission (assigned_team_id)');
        $this->addSql('CREATE TABLE mission_power (mission_id INTEGER NOT NULL, power_id INTEGER NOT NULL, PRIMARY KEY(mission_id, power_id), CONSTRAINT FK_3B1C5E9DBE6CAE90 FOREIGN KEY (mission_id) REFERENCES mission (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_3B1C5E9DAB4FC384 FOREIGN KEY (power_id) REFERENCES power (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_3B1C5E9DBE6CAE90 ON mission_power (mission_id)');
        $this->addSql('CREATE INDEX IDX_3B1C5E9DAB4FC384 ON mission_power (power_id)');
        $this->addSql('CREATE TABLE power (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, description CLOB NOT NULL, level INTEGER NOT NULL)');
        $this->addSql('CREATE TABLE super_hero (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, name VARCHAR(255) NOT NULL, alter_ego VARCHAR(255) DEFAULT NULL, is_available BOOLEAN NOT NULL, energy_level INTEGER NOT NULL, biography CLOB DEFAULT NULL, image_name VARCHAR(255) DEFAULT NULL, created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        )');
        $this->addSql('CREATE TABLE super_hero_power (super_hero_id INTEGER NOT NULL, power_id INTEGER NOT NULL, PRIMARY KEY(super_hero_id, power_id), CONSTRAINT FK_2275A209B62BE361 FOREIGN KEY (super_hero_id) REFERENCES super_hero (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_2275A209AB4FC384 FOREIGN KEY (power_id) REFERENCES power (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_2275A209B62BE361 ON super_hero_power (super_hero_id)');
        $this->addSql('CREATE INDEX IDX_2275A209AB4FC384 ON super_hero_power (power_id)');
        $this->addSql('CREATE TABLE team (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, leader_id INTEGER DEFAULT NULL, name VARCHAR(255) NOT NULL, is_active BOOLEAN NOT NULL, created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , CONSTRAINT FK_C4E0A61F73154ED4 FOREIGN KEY (leader_id) REFERENCES super_hero (id) NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_C4E0A61F73154ED4 ON team (leader_id)');
        $this->addSql('CREATE TABLE team_super_hero (team_id INTEGER NOT NULL, super_hero_id INTEGER NOT NULL, PRIMARY KEY(team_id, super_hero_id), CONSTRAINT FK_83E4152A296CD8AE FOREIGN KEY (team_id) REFERENCES team (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE, CONSTRAINT FK_83E4152AB62BE361 FOREIGN KEY (super_hero_id) REFERENCES super_hero (id) ON DELETE CASCADE NOT DEFERRABLE INITIALLY IMMEDIATE)');
        $this->addSql('CREATE INDEX IDX_83E4152A296CD8AE ON team_super_hero (team_id)');
        $this->addSql('CREATE INDEX IDX_83E4152AB62BE361 ON team_super_hero (super_hero_id)');
        $this->addSql('CREATE TABLE messenger_messages (id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, body CLOB NOT NULL, headers CLOB NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , available_at DATETIME NOT NULL --(DC2Type:datetime_immutable)
        , delivered_at DATETIME DEFAULT NULL --(DC2Type:datetime_immutable)
        )');
        $this->addSql('CREATE INDEX IDX_75EA56E0FB7336F0 ON messenger_messages (queue_name)');
        $this->addSql('CREATE INDEX IDX_75EA56E0E3BD61CE ON messenger_messages (available_at)');
        $this->addSql('CREATE INDEX IDX_75EA56E016BA31DB ON messenger_messages (delivered_at)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE mission');
        $this->addSql('DROP TABLE mission_power');
        $this->addSql('DROP TABLE power');
        $this->addSql('DROP TABLE super_hero');
        $this->addSql('DROP TABLE super_hero_power');
        $this->addSql('DROP TABLE team');
        $this->addSql('DROP TABLE team_super_hero');
        $this->addSql('DROP TABLE messenger_messages');
    }
}

<?php
// src/Controller/SuperHeroController.php
namespace App\Controller;

use App\Entity\SuperHero;
use App\Form\SuperHeroType;
use App\Repository\SuperHeroRepository;
use Doctrine\ORM\EntityManagerInterface;
use Knp\Component\Pager\PaginatorInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\String\Slugger\SluggerInterface;

#[Route('/super-hero')]
class SuperHeroController extends AbstractController
{
    #[Route('/', name: 'super_hero_index', methods: ['GET'])]
    public function index(
        Request $request,
        SuperHeroRepository $repository,
        PaginatorInterface $paginator
    ): Response {
        $availability = $request->query->get('availability');
        $energyMin = $request->query->get('energy_min');

        $queryBuilder = $repository->createQueryBuilder('sh')
            ->leftJoin('sh.powers', 'p')
            ->addSelect('p')
            ->orderBy('sh.createdAt', 'DESC');

        if ($availability !== null && $availability !== '') {
            $queryBuilder->andWhere('sh.isAvailable = :availability')
                ->setParameter('availability', (bool)$availability);
        }

        if ($energyMin) {
            $queryBuilder->andWhere('sh.energyLevel >= :energyMin')
                ->setParameter('energyMin', $energyMin);
        }

        $pagination = $paginator->paginate(
            $queryBuilder->getQuery(),
            $request->query->getInt('page', 1),
            12
        );

        return $this->render('super_hero/index.html.twig', [
            'pagination' => $pagination,
            'current_availability' => $availability,
            'current_energy_min' => $energyMin,
        ]);
    }

    #[Route('/new', name: 'super_hero_new', methods: ['GET', 'POST'])]
    public function new(
        Request $request,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): Response {
        $superHero = new SuperHero();
        $form = $this->createForm(SuperHeroType::class, $superHero);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Gestion de l'upload d'image
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename.'-'.uniqid().'.'.$imageFile->guessExtension();

                try {
                    $imageFile->move(
                        $this->getParameter('heroes_images_directory'),
                        $newFilename
                    );
                    $superHero->setImageName($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Erreur lors de l\'upload de l\'image');
                }
            }

            $entityManager->persist($superHero);
            $entityManager->flush();

            $this->addFlash('success', 'Le héros a été créé avec succès !');
            return $this->redirectToRoute('super_hero_show', ['id' => $superHero->getId()]);
        }

        return $this->render('super_hero/new.html.twig', [
            'super_hero' => $superHero,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'super_hero_show', methods: ['GET'])]
    public function show(SuperHero $superHero): Response
    {
        return $this->render('super_hero/show.html.twig', [
            'super_hero' => $superHero,
        ]);
    }

    #[Route('/{id}/edit', name: 'super_hero_edit', methods: ['GET', 'POST'])]
    public function edit(
        Request $request,
        SuperHero $superHero,
        EntityManagerInterface $entityManager,
        SluggerInterface $slugger
    ): Response {
        $form = $this->createForm(SuperHeroType::class, $superHero);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            // Gestion de l'upload d'image
            $imageFile = $form->get('imageFile')->getData();
            if ($imageFile) {
                $originalFilename = pathinfo($imageFile->getClientOriginalName(), PATHINFO_FILENAME);
                $safeFilename = $slugger->slug($originalFilename);
                $newFilename = $safeFilename.'-'.uniqid().'.'.$imageFile->guessExtension();

                try {
                    $imageFile->move(
                        $this->getParameter('heroes_images_directory'),
                        $newFilename
                    );

                    // Supprimer l'ancienne image
                    if ($superHero->getImageName()) {
                        $oldImagePath = $this->getParameter('heroes_images_directory').'/'.$superHero->getImageName();
                        if (file_exists($oldImagePath)) {
                            unlink($oldImagePath);
                        }
                    }

                    $superHero->setImageName($newFilename);
                } catch (FileException $e) {
                    $this->addFlash('error', 'Erreur lors de l\'upload de l\'image');
                }
            }

            $entityManager->flush();

            $this->addFlash('success', 'Le héros a été modifié avec succès !');
            return $this->redirectToRoute('super_hero_show', ['id' => $superHero->getId()]);
        }

        return $this->render('super_hero/edit.html.twig', [
            'super_hero' => $superHero,
            'form' => $form,
        ]);
    }

    #[Route('/{id}', name: 'super_hero_delete', methods: ['POST'])]
    public function delete(
        Request $request,
        SuperHero $superHero,
        EntityManagerInterface $entityManager
    ): Response {
        if ($this->isCsrfTokenValid('delete'.$superHero->getId(), $request->request->get('_token'))) {
            // Supprimer l'image
            if ($superHero->getImageName()) {
                $imagePath = $this->getParameter('heroes_images_directory').'/'.$superHero->getImageName();
                if (file_exists($imagePath)) {
                    unlink($imagePath);
                }
            }

            $entityManager->remove($superHero);
            $entityManager->flush();

            $this->addFlash('success', 'Le héros a été supprimé avec succès !');
        }

        return $this->redirectToRoute('super_hero_index');
    }
}

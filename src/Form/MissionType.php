<?php

namespace App\Form;

use App\Entity\Mission;
use App\Entity\Power;
use App\Entity\Team;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\ChoiceType;
use Symfony\Component\Form\Extension\Core\Type\DateTimeType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class MissionType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('title', TextType::class, [
                'label' => 'Titre de la mission',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ex: Sauver la ville de New York...'
                ],
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'attr' => [
                    'class' => 'form-control',
                    'rows' => 5,
                    'placeholder' => 'Décrivez les détails de la mission...'
                ],
            ])
            ->add('status', ChoiceType::class, [
                'label' => 'Statut',
                'choices' => Mission::getStatusChoices(),
                'attr' => ['class' => 'form-select'],
            ])
            ->add('startAt', DateTimeType::class, [
                'label' => 'Date de début',
                'widget' => 'single_text',
                'attr' => ['class' => 'form-control'],
            ])
            ->add('endAt', DateTimeType::class, [
                'label' => 'Date de fin (optionnel)',
                'widget' => 'single_text',
                'required' => false,
                'attr' => ['class' => 'form-control'],
            ])
            ->add('location', TextType::class, [
                'label' => 'Lieu',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ex: New York, Paris, Tokyo...'
                ],
            ])
            ->add('dangerLevel', IntegerType::class, [
                'label' => 'Niveau de danger (1-5)',
                'attr' => [
                    'class' => 'form-control',
                    'min' => 1,
                    'max' => 5,
                    'step' => 1,
                ],
            ])
            ->add('assignedTeam', EntityType::class, [
                'class' => Team::class,
                'choice_label' => 'name',
                'label' => 'Équipe assignée',
                'required' => false,
                'attr' => ['class' => 'form-select'],
                'placeholder' => 'Aucune équipe assignée',
            ])
            ->add('requiredPowers', EntityType::class, [
                'class' => Power::class,
                'choice_label' => 'name',
                'multiple' => true,
                'label' => 'Pouvoirs requis',
                'attr' => [
                    'class' => 'form-select',
                    'size' => 6,
                ],
                'help' => 'Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs pouvoirs',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Mission::class,
        ]);
    }
}

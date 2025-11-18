<?php

namespace App\Form;

use App\Entity\SuperHero;
use App\Entity\Team;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class TeamType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom de l\'équipe',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ex: Les Vengeurs, La Ligue de Justice...'
                ],
            ])
            ->add('isActive', CheckboxType::class, [
                'label' => 'Équipe active',
                'required' => false,
                'attr' => ['class' => 'form-check-input'],
            ])
            ->add('leader', EntityType::class, [
                'class' => SuperHero::class,
                'choice_label' => 'name',
                'label' => 'Leader de l\'équipe',
                'attr' => ['class' => 'form-select'],
                'placeholder' => 'Sélectionnez un leader...',
            ])
            ->add('members', EntityType::class, [
                'class' => SuperHero::class,
                'choice_label' => 'name',
                'multiple' => true,
                'label' => 'Membres de l\'équipe',
                'attr' => [
                    'class' => 'form-select',
                    'size' => 8,
                ],
                'help' => 'Maintenez Ctrl (ou Cmd sur Mac) pour sélectionner plusieurs membres. Une équipe doit avoir entre 2 et 5 membres.',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Team::class,
        ]);
    }
}

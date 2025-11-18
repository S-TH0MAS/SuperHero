<?php

namespace App\Form;

use App\Entity\Power;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;

class PowerType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom du pouvoir',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ex: Vol, Force surhumaine, Télépathie...'
                ],
            ])
            ->add('description', TextareaType::class, [
                'label' => 'Description',
                'attr' => [
                    'class' => 'form-control',
                    'rows' => 4,
                    'placeholder' => 'Décrivez ce pouvoir en détail...'
                ],
            ])
            ->add('level', IntegerType::class, [
                'label' => 'Niveau (1-5)',
                'attr' => [
                    'class' => 'form-control',
                    'min' => 1,
                    'max' => 5,
                    'step' => 1,
                ],
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => Power::class,
        ]);
    }
}

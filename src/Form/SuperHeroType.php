<?php
// src/Form/SuperHeroType.php
namespace App\Form;

use App\Entity\Power;
use App\Entity\SuperHero;
use Symfony\Bridge\Doctrine\Form\Type\EntityType;
use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\Extension\Core\Type\CheckboxType;
use Symfony\Component\Form\Extension\Core\Type\FileType;
use Symfony\Component\Form\Extension\Core\Type\IntegerType;
use Symfony\Component\Form\Extension\Core\Type\TextareaType;
use Symfony\Component\Form\Extension\Core\Type\TextType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolver;
use Symfony\Component\Validator\Constraints\File;
use Symfony\Component\Validator\Constraints\Image;

class SuperHeroType extends AbstractType
{
    public function buildForm(FormBuilderInterface $builder, array $options): void
    {
        $builder
            ->add('name', TextType::class, [
                'label' => 'Nom du héros',
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ex: Captain Cosmos'
                ],
            ])
            ->add('alterEgo', TextType::class, [
                'label' => 'Identité secrète',
                'required' => false,
                'attr' => [
                    'class' => 'form-control',
                    'placeholder' => 'Ex: Steve Rogers'
                ],
            ])
            ->add('isAvailable', CheckboxType::class, [
                'label' => 'Disponible pour une mission',
                'required' => false,
                'attr' => ['class' => 'form-check-input'],
            ])
            ->add('energyLevel', IntegerType::class, [
                'label' => 'Niveau d\'énergie (0-100)',
                'attr' => [
                    'class' => 'form-control',
                    'min' => 0,
                    'max' => 100,
                    'step' => 1,
                ],
            ])
            ->add('biography', TextareaType::class, [
                'label' => 'Biographie',
                'required' => false,
                'attr' => [
                    'class' => 'form-control',
                    'rows' => 5,
                    'placeholder' => 'Racontez l\'histoire de ce héros...'
                ],
            ])
            ->add('imageFile', FileType::class, [
                'label' => 'Photo du héros',
                'mapped' => false,
                'required' => false,
                'constraints' => [
                    new Image([
                        'maxSize' => '2M',
                        'mimeTypes' => [
                            'image/jpeg',
                            'image/png',
                            'image/gif',
                        ],
                        'mimeTypesMessage' => 'Veuillez uploader une image valide (JPEG, PNG, GIF)',
                    ])
                ],
                'attr' => ['class' => 'form-control'],
            ])
            ->add('powers', EntityType::class, [
                'class' => Power::class,
                'choice_label' => 'name',
                'multiple' => true,
                'expanded' => false,
                'label' => 'Pouvoirs',
                'attr' => [
                    'class' => 'form-select',
                    'size' => 8,
                ],
                'help' => 'Maintenez Ctrl/Cmd pour sélectionner plusieurs pouvoirs',
            ])
        ;
    }

    public function configureOptions(OptionsResolver $resolver): void
    {
        $resolver->setDefaults([
            'data_class' => SuperHero::class,
        ]);
    }
}

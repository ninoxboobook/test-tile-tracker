'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { profileUpdateSchema, type ProfileUpdateFormData } from '@/lib/schemas/user'
import { Form } from '@/components/ui/forms/form'
import { FormField } from '@/components/ui/forms/form-field'
import { ActionButton } from '@/components/ui/buttons/action-button'
import { CancelButton } from '@/components/ui/buttons/cancel-button'
import { updateProfile } from '@/app/(dashboard)/profile/actions'
import { 
  getUserTestTilesCount, 
  getUserCollectionsCount, 
  getUserDecorationsCount, 
  getUserClayBodiesCount,
  updateTestTilesVisibility,
  updateCollectionsVisibility,
  updateDecorationsVisibility,
  updateClayBodiesVisibility
} from '@/app/(dashboard)/profile/actions'
import { ProfileImage } from '@/components/profile/profile-image'
import Link from 'next/link'
import { Switch } from '@headlessui/react'
import { Dialog } from '@/components/ui/dialog'

interface ProfileFormProps {
  initialData?: Partial<ProfileUpdateFormData>
}

export function ProfileForm({ initialData }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [imageUrl, setImageUrl] = useState(initialData?.imageUrl)
  const [initialPublicTestTiles, setInitialPublicTestTiles] = useState(initialData?.publicTestTiles)
  const [initialPublicCollections, setInitialPublicCollections] = useState(initialData?.publicCollections)
  const [initialPublicDecorations, setInitialPublicDecorations] = useState(initialData?.publicDecorations)
  const [initialPublicClayBodies, setInitialPublicClayBodies] = useState(initialData?.publicClayBodies)
  const [showTestTilesDialog, setShowTestTilesDialog] = useState(false)
  const [showCollectionsDialog, setShowCollectionsDialog] = useState(false)
  const [showDecorationsDialog, setShowDecorationsDialog] = useState(false)
  const [showClayBodiesDialog, setShowClayBodiesDialog] = useState(false)
  const [testTilesCount, setTestTilesCount] = useState<{ public: number; private: number; total: number } | null>(null)
  const [collectionsCount, setCollectionsCount] = useState<{ public: number; private: number; total: number } | null>(null)
  const [decorationsCount, setDecorationsCount] = useState<{ public: number; private: number; total: number } | null>(null)
  const [clayBodiesCount, setClayBodiesCount] = useState<{ public: number; private: number; total: number } | null>(null)
  const [switchingTestTilesToPublic, setSwitchingTestTilesToPublic] = useState<boolean | null>(null)
  const [switchingCollectionsToPublic, setSwitchingCollectionsToPublic] = useState<boolean | null>(null)
  const [switchingDecorationsToPublic, setSwitchingDecorationsToPublic] = useState<boolean | null>(null)
  const [switchingClayBodiesToPublic, setSwitchingClayBodiesToPublic] = useState<boolean | null>(null)

  const {
    register,
    formState: { errors, dirtyFields },
    handleSubmit,
    setValue,
    watch,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: initialData,
  })

  const isPublic = watch('isPublic')
  const publicTestTiles = watch('publicTestTiles')
  const publicCollections = watch('publicCollections')
  const publicDecorations = watch('publicDecorations')
  const publicClayBodies = watch('publicClayBodies')

  const onSubmit = async (data: ProfileUpdateFormData) => {
    try {
      setIsSubmitting(true)
      setMessage(null)

      if (initialPublicTestTiles !== data.publicTestTiles) {
        console.log('test tiles visibility changed!', data.publicTestTiles)
      }

      if (initialPublicCollections !== data.publicCollections) {
        console.log('collections visibility changed!', data.publicCollections)
      }

      if (initialPublicDecorations !== data.publicDecorations) {
        console.log('decorations visibility changed!', data.publicDecorations)
      }

      if (initialPublicClayBodies !== data.publicClayBodies) {
        console.log('clay bodies visibility changed!', data.publicClayBodies)
      }

      const formData = new FormData()

      Object.entries(data).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, value.toString())
        }
      })

      if (imageUrl) {
        formData.append('imageUrl', imageUrl)
      }

      await updateProfile(formData)
      setInitialPublicTestTiles(data.publicTestTiles)
      setInitialPublicCollections(data.publicCollections)
      setInitialPublicDecorations(data.publicDecorations)
      setInitialPublicClayBodies(data.publicClayBodies)
      setMessage({ type: 'success', text: 'Profile updated successfully' })
    } catch (error) {
      setMessage({
        type: 'error',
        text: error instanceof Error ? error.message : 'Failed to update profile'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormSubmit = async (formData: FormData) => {
    const formDataObj = Object.fromEntries(formData.entries())
    await handleSubmit(onSubmit)(formDataObj as any)
  }

  const handleImageSelected = (url: string) => {
    setImageUrl(url)
    setValue('imageUrl', url)
  }

  return (
    <Form onSubmit={handleFormSubmit}>
      <div className="grid grid-cols-12 gap-8">
        {message && (
          <div className="col-span-12">
            <div
              className={`p-4 rounded-md ${message.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
                }`}
            >
              {message.text}
            </div>
          </div>
        )}

        <div className="col-span-12 md:col-span-4">
          <div className="bg-sand-light rounded-2xl p-8 space-y-6 flex flex-col items-center">
            <ProfileImage
              currentImageUrl={imageUrl}
              onImageSelected={handleImageSelected}
              initials={initialData?.username?.[0]?.toUpperCase() || 'U'}
            />
            <div className="text-center">
              {initialData?.firstName && initialData?.lastName ? (
                <>
                  <h2 className="text-2xl font-semibold text-clay-800">
                    {initialData?.firstName} {initialData?.lastName}
                  </h2>
                  <p className="text-clay-500">@{initialData?.username}
                  </p>
                </>
              ) : (
                <h2 className="text-2xl font-semibold text-clay-800">
                  {initialData?.username}
                </h2>
              )}
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-8 bg-sand-light rounded-2xl p-8">
          <div className="space-y-6 pb-12">
            <h3 className="text-xl font-semibold mb-4 text-clay-800">Your details</h3>

            <FormField
              label="Username"
              name="username"
              register={register}
              error={errors.username}
              placeholder="Enter your username"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="First Name"
                name="firstName"
                register={register}
                error={errors.firstName}
                placeholder="Enter your first name"
              />

              <FormField
                label="Last Name"
                name="lastName"
                register={register}
                error={errors.lastName}
                placeholder="Enter your last name"
              />
            </div>

            <FormField
              label="Email"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              placeholder="Enter your email"
            />
          </div>

          <div className="border-t pt-10 pb-12">
            <h3 className="text-xl font-semibold mb-4 text-clay-800">Privacy and visibility</h3>
            <h4 className="text-lg font-semibold mb-6 text-clay-800">Profile visibility</h4>
            <div className="flex items-center justify-between p-4 mb-8 border border-solid border-clay-300 rounded-md">
              <div>
                <h4 className="font-medium text-clay-800">Make profile public</h4>
                <p className="text-sm text-clay-600 mb-[2px]">Your profile will be visible to all Test Tile Tracker visitors. Content that you haven't made public will still be hidden.</p>
              </div>
              <Switch
                checked={isPublic ?? false}
                onChange={(checked) => setValue('isPublic', checked)}
                className={`${isPublic ? 'bg-brand' : 'bg-clay-300'
                  } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
              >
                <span className="sr-only">Enable public profile</span>
                <span
                  className={`${isPublic ? 'translate-x-6' : 'translate-x-1'
                    } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                />
              </Switch>
            </div>

            <h4 className="text-lg font-semibold mb-2 text-clay-800">Content visibility</h4>
            <p className="text-clay-800 mb-6">Public content is visible to all Test Tile Tracker visitors. You can also manage visibility on individual items.</p>
            <div className="border border-solid border-clay-300 rounded-md">
              <div className="flex items-center justify-between p-4 border-b border-solid border-clay-200">
                <div>
                  <h4 className="font-medium text-clay-800">Make test tiles public by default</h4>
                  <p className="text-sm max-w-xl text-clay-600 mb-[2px]">New test tiles that you make will be visible to all Test Tile Tracker visitors by default, unless you choose to make them private.</p>
                </div>
                <Switch
                  checked={publicTestTiles ?? false}
                  onChange={async (checked) => {
                    setValue('publicTestTiles', checked)
                    const counts = await getUserTestTilesCount()
                    setTestTilesCount(counts)
                    if ((checked && counts.private > 0) || (!checked && counts.public > 0)) {
                      setSwitchingTestTilesToPublic(checked)
                      setShowTestTilesDialog(true)
                    }
                  }}
                  className={`${publicTestTiles ? 'bg-brand' : 'bg-clay-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
                >
                  <span className="sr-only">Enable public test tiles by default</span>
                  <span
                    className={`${publicTestTiles ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between p-4 border-b border-solid border-clay-200">
                <div>
                  <h4 className="font-medium text-clay-800">Make collections public by default</h4>
                  <p className="text-sm max-w-xl text-clay-600 mb-[2px]">New collections that you make will be visible to all Test Tile Tracker visitors by default, unless you choose to make them private.</p>
                </div>
                <Switch
                  checked={publicCollections ?? false}
                  onChange={async (checked) => {
                    setValue('publicCollections', checked)
                    const counts = await getUserCollectionsCount()
                    setCollectionsCount(counts)
                    if ((checked && counts.private > 0) || (!checked && counts.public > 0)) {
                      setSwitchingCollectionsToPublic(checked)
                      setShowCollectionsDialog(true)
                    }
                  }}
                  className={`${publicCollections ? 'bg-brand' : 'bg-clay-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
                >
                  <span className="sr-only">Enable public collections by default</span>
                  <span
                    className={`${publicCollections ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between p-4 border-b border-solid border-clay-200">
                <div>
                  <h4 className="font-medium text-clay-800">Make decorations public by default</h4>
                  <p className="text-sm max-w-xl text-clay-600 mb-[2px]">New decorations that you make will be visible to all Test Tile Tracker visitors by default, unless you choose to make them private.</p>
                </div>
                <Switch
                  checked={publicDecorations ?? false}
                  onChange={async (checked) => {
                    setValue('publicDecorations', checked)
                    const counts = await getUserDecorationsCount()
                    setDecorationsCount(counts)
                    if ((checked && counts.private > 0) || (!checked && counts.public > 0)) {
                      setSwitchingDecorationsToPublic(checked)
                      setShowDecorationsDialog(true)
                    }
                  }}
                  className={`${publicDecorations ? 'bg-brand' : 'bg-clay-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
                >
                  <span className="sr-only">Enable public decorations by default</span>
                  <span
                    className={`${publicDecorations ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>

              <div className="flex items-center justify-between p-4">
                <div>
                  <h4 className="font-medium text-clay-800">Make clay bodies public by default</h4>
                  <p className="text-sm max-w-xl text-clay-600 mb-[2px]">New clay bodies that you make will be visible to all Test Tile Tracker visitors by default, unless you choose to make them private.</p>
                </div>
                <Switch
                  checked={publicClayBodies ?? false}
                  onChange={async (checked) => {
                    setValue('publicClayBodies', checked)
                    const counts = await getUserClayBodiesCount()
                    setClayBodiesCount(counts)
                    if ((checked && counts.private > 0) || (!checked && counts.public > 0)) {
                      setSwitchingClayBodiesToPublic(checked)
                      setShowClayBodiesDialog(true)
                    }
                  }}
                  className={`${publicClayBodies ? 'bg-brand' : 'bg-clay-300'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-clay-600 focus:ring-offset-2`}
                >
                  <span className="sr-only">Enable public clay bodies by default</span>
                  <span
                    className={`${publicClayBodies ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                  />
                </Switch>
              </div>
            </div>

          </div>

          <div className="border-t pt-10 space-y-6 pb-12">
            <h3 className="text-xl font-semibold  mb-4 text-clay-800">Change password</h3>

            <FormField
              label="Current Password"
              name="currentPassword"
              type="password"
              register={register}
              error={errors.currentPassword}
              placeholder="Enter your current password"
            />

            <FormField
              label="New Password"
              name="newPassword"
              type="password"
              register={register}
              error={errors.newPassword}
              placeholder="Enter your new password"
            />

            <FormField
              label="Confirm New Password"
              name="confirmNewPassword"
              type="password"
              register={register}
              error={errors.confirmNewPassword}
              placeholder="Confirm your new password"
            />
          </div>

          <div className="border-t pt-10">
            <h3 className="text-xl font-semibold text-clay-800 mb-1">Delete account</h3>
            <p className="text-clay-700 mb-6">Account deletion is permanent and cannot be undone. Please be certain before proceeding - all of your data will be lost.</p>
            <div>
              <Link href="/profile/delete">
                <ActionButton variant="danger" type="button">
                  Delete account
                </ActionButton>
              </Link>
            </div>
          </div>
        </div>
        <div className="col-span-12">
          <div className="flex justify-end space-x-3">
            <CancelButton
              hasUnsavedChanges={() => Object.keys(dirtyFields).length > 0}
              type="button"
              onCancel={() => window.location.href = '/dashboard'}
            />
            <ActionButton
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </ActionButton>
          </div>
        </div>
      </div>
      <Dialog
        open={showTestTilesDialog}
        onClose={() => {
          setShowTestTilesDialog(false)
          setSwitchingTestTilesToPublic(null)
        }}
        variant="info"
        title={switchingTestTilesToPublic 
          ? "Make existing private test tiles public?" 
          : "Make existing public test tiles private?"
        }
        description={testTilesCount && switchingTestTilesToPublic !== null
          ? switchingTestTilesToPublic
            ? `You have ${testTilesCount.private} private test ${testTilesCount.private === 1 ? 'tile' : 'tiles'} in your library. Would you like to make ${testTilesCount.private === 1 ? 'it' : 'these'} public as well?`
            : `You have ${testTilesCount.public} public test ${testTilesCount.public === 1 ? 'tile' : 'tiles'} in your library. Would you like to make ${testTilesCount.public === 1 ? 'it' : 'these'} private as well?`
          : 'Loading...'
        }
        confirmLabel={switchingTestTilesToPublic ? "Yes, make public" : "Yes, make private"}
        cancelLabel="No, keep as is"
        onConfirm={async () => {
          if (switchingTestTilesToPublic !== null) {
            try {
              await updateTestTilesVisibility(switchingTestTilesToPublic)
              const newCounts = await getUserTestTilesCount()
              setTestTilesCount(newCounts)
              setMessage({ 
                type: 'success', 
                text: `Successfully updated visibility for ${switchingTestTilesToPublic ? 'private' : 'public'} test tiles` 
              })
            } catch (error) {
              setMessage({ 
                type: 'error', 
                text: `Failed to update test tiles visibility: ${error instanceof Error ? error.message : 'Unknown error'}` 
              })
            }
          }
          setShowTestTilesDialog(false)
          setSwitchingTestTilesToPublic(null)
        }}
      />

      <Dialog
        open={showCollectionsDialog}
        onClose={() => {
          setShowCollectionsDialog(false)
          setSwitchingCollectionsToPublic(null)
        }}
        variant="info"
        title={switchingCollectionsToPublic 
          ? "Make existing private collections public?" 
          : "Make existing public collections private?"
        }
        description={collectionsCount && switchingCollectionsToPublic !== null
          ? switchingCollectionsToPublic
            ? `You have ${collectionsCount.private} private ${collectionsCount.private === 1 ? 'collection' : 'collections'} in your library. Would you like to make ${collectionsCount.private === 1 ? 'it' : 'these'} public as well?`
            : `You have ${collectionsCount.public} public ${collectionsCount.public === 1 ? 'collection' : 'collections'} in your library. Would you like to make ${collectionsCount.public === 1 ? 'it' : 'these'} private as well?`
          : 'Loading...'
        }
        confirmLabel={switchingCollectionsToPublic ? "Yes, make public" : "Yes, make private"}
        cancelLabel="No, keep as is"
        onConfirm={async () => {
          if (switchingCollectionsToPublic !== null) {
            try {
              await updateCollectionsVisibility(switchingCollectionsToPublic)
              const newCounts = await getUserCollectionsCount()
              setCollectionsCount(newCounts)
              setMessage({ 
                type: 'success', 
                text: `Successfully updated visibility for ${switchingCollectionsToPublic ? 'private' : 'public'} collections` 
              })
            } catch (error) {
              setMessage({ 
                type: 'error', 
                text: `Failed to update collections visibility: ${error instanceof Error ? error.message : 'Unknown error'}` 
              })
            }
          }
          setShowCollectionsDialog(false)
          setSwitchingCollectionsToPublic(null)
        }}
      />

      <Dialog
        open={showDecorationsDialog}
        onClose={() => {
          setShowDecorationsDialog(false)
          setSwitchingDecorationsToPublic(null)
        }}
        variant="info"
        title={switchingDecorationsToPublic 
          ? "Make existing private decorations public?" 
          : "Make existing public decorations private?"
        }
        description={decorationsCount && switchingDecorationsToPublic !== null
          ? switchingDecorationsToPublic
            ? `You have ${decorationsCount.private} private ${decorationsCount.private === 1 ? 'decoration' : 'decorations'} in your library. Would you like to make ${decorationsCount.private === 1 ? 'it' : 'these'} public as well?`
            : `You have ${decorationsCount.public} public ${decorationsCount.public === 1 ? 'decoration' : 'decorations'} in your library. Would you like to make ${decorationsCount.public === 1 ? 'it' : 'these'} private as well?`
          : 'Loading...'
        }
        confirmLabel={switchingDecorationsToPublic ? "Yes, make public" : "Yes, make private"}
        cancelLabel="No, keep as is"
        onConfirm={async () => {
          if (switchingDecorationsToPublic !== null) {
            try {
              await updateDecorationsVisibility(switchingDecorationsToPublic)
              const newCounts = await getUserDecorationsCount()
              setDecorationsCount(newCounts)
              setMessage({ 
                type: 'success', 
                text: `Successfully updated visibility for ${switchingDecorationsToPublic ? 'private' : 'public'} decorations` 
              })
            } catch (error) {
              setMessage({ 
                type: 'error', 
                text: `Failed to update decorations visibility: ${error instanceof Error ? error.message : 'Unknown error'}` 
              })
            }
          }
          setShowDecorationsDialog(false)
          setSwitchingDecorationsToPublic(null)
        }}
      />

      <Dialog
        open={showClayBodiesDialog}
        onClose={() => {
          setShowClayBodiesDialog(false)
          setSwitchingClayBodiesToPublic(null)
        }}
        variant="info"
        title={switchingClayBodiesToPublic 
          ? "Make existing private clay bodies public?" 
          : "Make existing public clay bodies private?"
        }
        description={clayBodiesCount && switchingClayBodiesToPublic !== null
          ? switchingClayBodiesToPublic
            ? `You have ${clayBodiesCount.private} private clay ${clayBodiesCount.private === 1 ? 'body' : 'bodies'} in your library. Would you like to make ${clayBodiesCount.private === 1 ? 'it' : 'these'} public as well?`
            : `You have ${clayBodiesCount.public} public clay ${clayBodiesCount.public === 1 ? 'body' : 'bodies'} in your library. Would you like to make ${clayBodiesCount.public === 1 ? 'it' : 'these'} private as well?`
          : 'Loading...'
        }
        confirmLabel={switchingClayBodiesToPublic ? "Yes, make public" : "Yes, make private"}
        cancelLabel="No, keep as is"
        onConfirm={async () => {
          if (switchingClayBodiesToPublic !== null) {
            try {
              await updateClayBodiesVisibility(switchingClayBodiesToPublic)
              const newCounts = await getUserClayBodiesCount()
              setClayBodiesCount(newCounts)
              setMessage({ 
                type: 'success', 
                text: `Successfully updated visibility for ${switchingClayBodiesToPublic ? 'private' : 'public'} clay bodies` 
              })
            } catch (error) {
              setMessage({ 
                type: 'error', 
                text: `Failed to update clay bodies visibility: ${error instanceof Error ? error.message : 'Unknown error'}` 
              })
            }
          }
          setShowClayBodiesDialog(false)
          setSwitchingClayBodiesToPublic(null)
        }}
      />
    </Form>
  )
}

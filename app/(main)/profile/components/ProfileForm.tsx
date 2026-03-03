'use client';

import type { User } from '@/app/types/user';
import { useForm } from 'react-hook-form';
import { updateUser } from '@/app/actions/user';
import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/app/lib/supabase/browser-client';
import PhotoUpload from './PhotoUpload';
import defaultProfilePhoto from '@/public/default-profile-picture.png';

export default function ProfileForm({ user }: { user: User }) {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [hasUploadedPhoto, setHasUploadedPhoto] = useState(false);
    const supabase = createClient();
    const photoUploadRef = useRef<{ resetFile: () => void }>(null);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isDirty },
    } = useForm({
        defaultValues: {
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
        },
    });

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setPhotoUrl(defaultProfilePhoto.src);
                    setHasUploadedPhoto(false);
                    return;
                }

                const { data: files, error: listError } = await supabase.storage
                    .from('profile_photos')
                    .list(user.id);

                if (listError) {
                    console.error('Error listing files:', listError.message);
                    setPhotoUrl(defaultProfilePhoto.src);
                    setHasUploadedPhoto(false);
                    return;
                }

                // Check if profile.jpg exists AND files array is not empty
                const profilePhoto = files?.find(f => f.name === 'profile.jpg');

                if (profilePhoto) {
                    const { data } = supabase.storage
                        .from('profile_photos')
                        .getPublicUrl(`${user.id}/profile.jpg`);

                    const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
                    setPhotoUrl(freshUrl);
                    setHasUploadedPhoto(true);
                } else {
                    // No photo exists, use default photo
                    setPhotoUrl(defaultProfilePhoto.src);
                    setHasUploadedPhoto(false);
                }
            } catch (error) {
                console.error('Error fetching profile photo:', error);
                setPhotoUrl(defaultProfilePhoto.src);
                setHasUploadedPhoto(false);
            }
        };

        fetchProfilePhoto();
    }, [supabase.auth, supabase.storage]);

    const handleFileSelect = (file: File) => {
        const maxSize = 200 * 1024; // 200KB in bytes
        if (file.size > maxSize) {
            alert('File is too large. Please select an image under 5MB.');
            return;
        }   
        // Create a temporary local blob URL for immediate UI feedback
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
        setSelectedFile(file);
    };
    /**
     * Uploads the selected file to Supabase Storage and updates the user's profile.
     * * Process:
     * 1. Authenticates current user session.
     * 2. Uploads/Overrides the file in the 'profile_photos' bucket using a consistent naming convention.
     * 3. Generates a cache-busted public URL using a timestamp.
     * 4. Syncs the new URL to the application database via 'updateUser'.
     * 5. Cleans up memory by revoking the temporary object URL.
     */
    const handleSave = async () => {
        if (!selectedFile) return;

        setUploading(true);
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.storage
                .from('profile_photos')
                .upload(`${user.id}/profile.jpg`, selectedFile, { upsert: true });

            if (error) {
                console.error('Upload error:', error.message);
            } else {
                const { data } = supabase.storage
                    .from('profile_photos')
                    .getPublicUrl(`${user.id}/profile.jpg`);

                const freshUrl = `${data.publicUrl}?t=${Date.now()}`;
                setPhotoUrl(freshUrl);
                setHasUploadedPhoto(true);

                await updateUser(user.id, {
                    email: user.user_metadata.email,
                    first_name: user.user_metadata.first_name,
                    last_name: user.user_metadata.last_name,
                    profile_photo_url: freshUrl,
                });

                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
                setSelectedFile(null);
                photoUploadRef.current?.resetFile();
            }
        }
        setUploading(false);
    };

    const handleCancel = () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        setSelectedFile(null);
        photoUploadRef.current?.resetFile();
    };


    const handleRemove = async () => {
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
            const { error } = await supabase.storage
                .from('profile_photos')
                .remove([`${user.id}/profile.jpg`]);

            if (error) {
                console.error('Remove error:', error.message);
                return;
            }

            await updateUser(user.id, {
                email: user.user_metadata.email,
                first_name: user.user_metadata.first_name,
                last_name: user.user_metadata.last_name,
                profile_photo_url: '',
            });
        }

        setPhotoUrl(defaultProfilePhoto.src);
        setPreviewUrl(null);
        setSelectedFile(null);
        setHasUploadedPhoto(false);
        photoUploadRef.current?.resetFile();
    };

    const onSubmit = async (data: {
        firstName: string;
        lastName: string;
        email: string;
    }) => {
        await updateUser(user.user_id, {
            first_name: data.firstName,
            last_name: data.lastName,
            email: data.email,
            profile_photo_url: photoUrl ?? '',
        });

        reset({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
        });
    };

    const onCancel = () => {
        reset();
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <label>First name</label>
            <input {...register('firstName', { required: true })} />
            {errors.firstName?.type === 'required' && (
                <p role="alert">First name is required.</p>
            )}
            <br />
            <label>Last name</label>
            <input {...register('lastName', { required: true })} />
            {errors.lastName?.type === 'required' && (
                <p role="alert">Last name is required.</p>
            )}
            <br />
            <label>Email</label>
            <input {...register('email', { required: true })} />
            {errors.email?.type === 'required' && (
                <p role="alert">Email is required.</p>
            )}
            <br />

            <h2>Profile Photo</h2>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <PhotoUpload ref={photoUploadRef} onFileSelect={handleFileSelect} />
                    {previewUrl && (
                        <div>
                            <img
                                src={previewUrl}
                                alt="Preview"
                                style={{ width: '64px', height: '64px', objectFit: 'cover'}}
                            />
                            <br />
                            <button type="button" onClick={handleSave} disabled={uploading}>
                                {uploading ? 'Saving...' : 'Save'}
                            </button>
                            <button type="button" onClick={handleCancel} disabled={uploading}>
                                Cancel
                            </button>
                        </div>
                    )}
                    {photoUrl && !previewUrl && (
                        <div>
                            <img
                                src={photoUrl}
                                alt="Profile"
                                className="w-16 h-16 rounded-full object-cover"
                                style={{ width: '64px', height: '64px', objectFit: 'cover'}}
                                onError={(e) => {
                                    e.currentTarget.src = defaultProfilePhoto.src;
                                    setHasUploadedPhoto(false);
                                }}
                            />
                            {hasUploadedPhoto && (
                                <button type="button" onClick={handleRemove} disabled={uploading}>
                                    Remove
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}

            {isDirty && (
                <>
                    <button type="button" onClick={onCancel}>
                        Cancel
                    </button>
                    <button type="submit">Save</button>
                </>
            )}
        </form>
    );
}
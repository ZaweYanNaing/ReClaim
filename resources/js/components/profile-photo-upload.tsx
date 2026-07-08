import { Camera, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ProfilePhotoUploadProps = {
    currentPhotoUrl?: string | null;
    error?: string;
};

export default function ProfilePhotoUpload({
    currentPhotoUrl,
    error,
}: ProfilePhotoUploadProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [removePhoto, setRemovePhoto] = useState(false);

    const displayUrl = removePhoto ? null : (previewUrl ?? currentPhotoUrl);

    function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        setRemovePhoto(false);
        setPreviewUrl(URL.createObjectURL(file));
    }

    function handleRemove() {
        setPreviewUrl(null);
        setRemovePhoto(true);

        if (inputRef.current) {
            inputRef.current.value = '';
        }
    }

    return (
        <div className="grid gap-3">
            <Label>Profile photo</Label>

            <div className="flex items-center gap-4">
                <div
                    className={cn(
                        'flex size-20 items-center justify-center overflow-hidden rounded-2xl border border-border bg-cream-dark text-muted-foreground',
                    )}
                >
                    {displayUrl ? (
                        <img
                            src={displayUrl}
                            alt="Profile preview"
                            className="size-full object-cover"
                        />
                    ) : (
                        <Camera className="size-7 opacity-60" />
                    )}
                </div>

                <div className="flex flex-col gap-2">
                    <input
                        ref={inputRef}
                        id="profile_photo"
                        name="profile_photo"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        className="hidden"
                        onChange={handleFileChange}
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => inputRef.current?.click()}
                    >
                        Upload photo
                    </Button>
                    {(displayUrl || currentPhotoUrl) && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={handleRemove}
                        >
                            <X className="size-4" />
                            Remove photo
                        </Button>
                    )}
                </div>
            </div>

            {removePhoto && (
                <input type="hidden" name="remove_profile_photo" value="1" />
            )}

            <p className="text-xs text-muted-foreground">
                JPG, PNG, or WebP up to 2 MB. A friendly photo helps neighbors trust
                your reports.
            </p>

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

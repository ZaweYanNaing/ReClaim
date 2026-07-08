import { Camera, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/reclaim/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

type ReportPhotoUploadProps = {
    currentPhotoUrl?: string | null;
    error?: string;
};

export function ReportPhotoUpload({
    currentPhotoUrl,
    error,
}: ReportPhotoUploadProps) {
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
            <Label>Photo (optional)</Label>

            <div
                className={cn(
                    'rounded-2xl border border-dashed border-border bg-cream-dark/50 p-5',
                    error && 'border-destructive',
                )}
            >
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
                    <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-card">
                        {displayUrl ? (
                            <img
                                src={displayUrl}
                                alt="Report preview"
                                className="size-full object-cover"
                            />
                        ) : (
                            <Camera className="size-8 text-terracotta opacity-70" />
                        )}
                    </div>

                    <div className="flex flex-1 flex-col gap-2 text-center sm:text-left">
                        <p className="text-sm font-medium">
                            A clear photo helps neighbors recognize the item
                        </p>
                        <p className="text-xs text-muted-foreground">
                            JPG, PNG, or WebP up to 5 MB
                        </p>
                        <div className="mt-1 flex flex-wrap justify-center gap-2 sm:justify-start">
                            <input
                                ref={inputRef}
                                id="photo"
                                name="photo"
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
                                Choose photo
                            </Button>
                            {(displayUrl || currentPhotoUrl) && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleRemove}
                                >
                                    <X className="size-4" />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {removePhoto && (
                <input type="hidden" name="remove_photo" value="1" />
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
    );
}

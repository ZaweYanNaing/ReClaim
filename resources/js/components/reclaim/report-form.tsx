import type { FormDataConvertible } from '@inertiajs/core';
import { Button } from '@/components/reclaim/button';
import { FormInput, FormSelect, FormTextarea } from '@/components/reclaim/form-input';
import { ReportPhotoUpload } from '@/components/reclaim/report-photo-upload';
import type { Category, Township } from '@/types/reclaim';

export type ReportFormValues = {
    type: 'lost' | 'found';
    title: string;
    description: string;
    category_id: number | string;
    township_id: number | string;
    ward?: string | null;
    photo_url?: string | null;
    date_occurred: string;
};

type ReportFormFieldsProps = {
    townships: Township[];
    categories: Category[];
    values?: Partial<ReportFormValues>;
    errors: Partial<Record<string, string>>;
    processing: boolean;
    submitLabel: string;
};

export function ReportFormFields({
    townships,
    categories,
    values,
    errors,
    processing,
    submitLabel,
}: ReportFormFieldsProps) {
    return (
        <>
            <FormSelect
                label="Report type"
                name="type"
                defaultValue={values?.type ?? 'lost'}
                error={errors.type}
                options={[
                    { value: 'lost', label: 'I lost something' },
                    { value: 'found', label: 'I found something' },
                ]}
            />
            <FormInput
                label="Title"
                name="title"
                defaultValue={values?.title}
                placeholder="e.g. Brown leather wallet near 26th Street"
                error={errors.title}
                required
            />
            <FormTextarea
                label="Description"
                name="description"
                defaultValue={values?.description}
                placeholder="Share helpful details: color, markings, where it was last seen..."
                error={errors.description}
                required
            />
            <div className="grid gap-5 sm:grid-cols-2">
                <FormSelect
                    label="Category"
                    name="category_id"
                    defaultValue={
                        values?.category_id ? String(values.category_id) : ''
                    }
                    error={errors.category_id}
                    required
                    options={[
                        { value: '', label: 'Select category' },
                        ...categories.map((category) => ({
                            value: String(category.id),
                            label: category.name,
                        })),
                    ]}
                />
                <FormSelect
                    label="Township"
                    name="township_id"
                    defaultValue={
                        values?.township_id ? String(values.township_id) : ''
                    }
                    error={errors.township_id}
                    required
                    options={[
                        { value: '', label: 'Select township' },
                        ...townships.map((township) => ({
                            value: String(township.id),
                            label: township.name,
                        })),
                    ]}
                />
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
                <FormInput
                    label="Ward (optional)"
                    name="ward"
                    defaultValue={values?.ward ?? ''}
                    placeholder="Ward number or area"
                    error={errors.ward}
                />
                <FormInput
                    label="Date occurred"
                    name="date_occurred"
                    type="date"
                    defaultValue={values?.date_occurred ?? ''}
                    error={errors.date_occurred}
                    required
                    max={new Date().toISOString().split('T')[0]}
                />
            </div>
            <ReportPhotoUpload
                currentPhotoUrl={values?.photo_url}
                error={errors.photo}
            />
            <Button type="submit" className="w-full" disabled={processing}>
                {processing ? 'Saving...' : submitLabel}
            </Button>
        </>
    );
}

export function serializeReportFilters(
    filters: Record<string, FormDataConvertible>,
): Record<string, string> {
    return Object.fromEntries(
        Object.entries(filters).map(([key, value]) => [key, String(value ?? '')]),
    );
}

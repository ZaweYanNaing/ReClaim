import { Form, Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reclaim/card';
import { ReportFormFields } from '@/components/reclaim/report-form';
import { update } from '@/routes/reports';
import type { Category, Township } from '@/types/reclaim';

type ReportFormData = {
    id: number;
    type: 'lost' | 'found';
    title: string;
    description: string;
    category_id: number;
    township_id: number;
    ward: string | null;
    photo_url: string | null;
    date_occurred: string | null;
};

type Props = {
    report: ReportFormData;
    townships: Township[];
    categories: Category[];
};

export default function ReportEdit({ report, townships, categories }: Props) {
    return (
        <>
            <Head title={`Edit ${report.title}`} />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
                <div className="mb-8">
                    <h1 className="font-heading text-3xl font-bold">Edit report</h1>
                    <p className="mt-2 text-muted-foreground">
                        Update details if something has changed — every bit helps the search.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Report details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...update.form(report.id)}
                            options={{ forceFormData: true }}
                            encType="multipart/form-data"
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <ReportFormFields
                                    townships={townships}
                                    categories={categories}
                                    values={{
                                        type: report.type,
                                        title: report.title,
                                        description: report.description,
                                        category_id: report.category_id,
                                        township_id: report.township_id,
                                        ward: report.ward,
                                        photo_url: report.photo_url,
                                        date_occurred: report.date_occurred ?? '',
                                    }}
                                    errors={errors}
                                    processing={processing}
                                    submitLabel="Save changes"
                                />
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

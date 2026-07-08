import { Form, Head } from '@inertiajs/react';
import { HeartHandshake } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/reclaim/card';
import { ReportFormFields } from '@/components/reclaim/report-form';
import { store } from '@/routes/reports';
import type { Category, Township } from '@/types/reclaim';

type Props = {
    townships: Township[];
    categories: Category[];
};

export default function ReportCreate({ townships, categories }: Props) {
    return (
        <>
            <Head title="Create Report" />

            <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
                <div className="mb-8 text-center">
                    <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-2xl bg-terracotta-soft/25 text-terracotta">
                        <HeartHandshake className="size-7" />
                    </div>
                    <h1 className="font-heading text-3xl font-bold">Share a report</h1>
                    <p className="mt-2 text-muted-foreground">
                        Whether something is lost or found, your post helps the community
                        respond with care.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Report details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Form
                            {...store.form()}
                            options={{ forceFormData: true }}
                            encType="multipart/form-data"
                            className="space-y-5"
                        >
                            {({ processing, errors }) => (
                                <ReportFormFields
                                    townships={townships}
                                    categories={categories}
                                    errors={errors}
                                    processing={processing}
                                    submitLabel="Share with community"
                                />
                            )}
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

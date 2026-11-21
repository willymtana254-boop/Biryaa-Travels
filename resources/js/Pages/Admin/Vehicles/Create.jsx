import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import VehicleForm from '../../../Components/VehicleForm';

export default function VehiclesCreate({ categories }) {
    const form = useForm({
        name: '',
        category: 'economy',
        seats: 4,
        transmission: 'automatic',
        price_per_day: '',
        description: '',
        is_available: true,
        photo: null,
    });

    return (
        <AdminLayout>
            <Head title="Add Vehicle" />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Add Vehicle</h1>
            <VehicleForm
                form={form}
                categories={categories}
                submitLabel="Add Vehicle"
                onSubmit={(e) => { e.preventDefault(); form.post('/admin/vehicles', { forceFormData: true }); }}
            />
        </AdminLayout>
    );
}

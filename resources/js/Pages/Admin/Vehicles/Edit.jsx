import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '../../../Layouts/AdminLayout';
import VehicleForm from '../../../Components/VehicleForm';

export function imageSrc(src) {
    if (!src) return null;
    return /^(https?:)?\//.test(src) ? src : `/${src}`;
}

export default function VehiclesEdit({ vehicle, categories }) {
    const form = useForm({
        name: vehicle.name ?? '',
        category: vehicle.category ?? 'economy',
        seats: vehicle.seats ?? 4,
        transmission: vehicle.transmission ?? 'automatic',
        price_per_day: vehicle.price_per_day ?? '',
        description: vehicle.description ?? '',
        is_available: !!vehicle.is_available,
        photo: null,
    });

    return (
        <AdminLayout>
            <Head title={`Edit ${vehicle.name}`} />
            <h1 className="font-display text-2xl text-tide font-semibold mb-6">Edit Vehicle</h1>
            <VehicleForm
                form={form}
                categories={categories}
                currentImage={imageSrc(vehicle.images?.[0])}
                submitLabel="Save changes"
                onSubmit={(e) => { e.preventDefault(); form.post(`/admin/vehicles/${vehicle.id}`, { forceFormData: true }); }}
            />
        </AdminLayout>
    );
}

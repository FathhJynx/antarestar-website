<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::updateOrCreate(
            ['email' => 'admin@antarestar.com'],
            [
                'name' => 'Super Admin',
                'password' => 'admin123',
                'role' => 'admin',
                'phone' => '081234567890',
                'referral_code' => 'ADMIN-PRO-001'
            ]
        );

        echo "✅ Admin user created/updated successfully!\n";
        echo "📧 Email: admin@antarestar.com\n";
        echo "🔑 Password: admin123\n";
    }
}

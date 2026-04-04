<?php

namespace App\Services;

use App\Repositories\B2BRepository;

class B2BService
{
    protected B2BRepository $b2bRepository;

    public function __construct(B2BRepository $b2bRepository)
    {
        $this->b2bRepository = $b2bRepository;
    }

    public function createInquiry(array $data)
    {
        $data['status'] = 'pending';
        return $this->b2bRepository->create($data);
    }

    public function getInquiries(int $perPage = 15)
    {
        return $this->b2bRepository->getInquiries($perPage);
    }

    public function getInquiry(string $id)
    {
        return $this->b2bRepository->find($id);
    }

    public function updateInquiryStatus(string $id, string $status)
    {
        return $this->b2bRepository->update($id, ['status' => $status]);
    }
}

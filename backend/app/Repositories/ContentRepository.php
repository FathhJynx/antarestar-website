<?php

namespace App\Repositories;

use App\Models\Article;
use App\Models\Notification;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class ContentRepository extends BaseRepository
{
    protected Notification $notificationModel;

    public function __construct(Article $model, Notification $notificationModel)
    {
        parent::__construct($model);
        $this->notificationModel = $notificationModel;
    }

    // Articles
    public function getPublishedArticles(int $perPage = 15): LengthAwarePaginator
    {
        return $this->model->where('is_published', true)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function findArticleBySlug(string $slug): ?Article
    {
        return $this->model->where('slug', $slug)->first();
    }

    // Notifications
    public function getUserNotifications(string $userId, int $perPage = 20): LengthAwarePaginator
    {
        return $this->notificationModel->where('user_id', $userId)
            ->orderBy('created_at', 'desc')
            ->paginate($perPage);
    }

    public function getUnreadCount(string $userId): int
    {
        return $this->notificationModel->where('user_id', $userId)->where('is_read', false)->count();
    }

    public function markAsRead(string $id): Notification
    {
        $notification = $this->notificationModel->findOrFail($id);
        $notification->update(['is_read' => true]);
        return $notification->fresh();
    }

    public function markAllAsRead(string $userId): void
    {
        $this->notificationModel->where('user_id', $userId)->update(['is_read' => true]);
    }

    public function createNotification(array $data): Notification
    {
        return $this->notificationModel->create($data);
    }
}

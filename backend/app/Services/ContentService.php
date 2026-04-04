<?php

namespace App\Services;

use App\Repositories\ContentRepository;

class ContentService
{
    protected ContentRepository $contentRepository;

    public function __construct(ContentRepository $contentRepository)
    {
        $this->contentRepository = $contentRepository;
    }

    // Articles
    public function getPublishedArticles(int $perPage = 15)
    {
        return $this->contentRepository->getPublishedArticles($perPage);
    }

    public function getArticle(string $id)
    {
        return $this->contentRepository->find($id);
    }

    public function getArticleBySlug(string $slug)
    {
        return $this->contentRepository->findArticleBySlug($slug);
    }

    public function createArticle(array $data)
    {
        return $this->contentRepository->create($data);
    }

    public function updateArticle(string $id, array $data)
    {
        return $this->contentRepository->update($id, $data);
    }

    public function deleteArticle(string $id)
    {
        return $this->contentRepository->delete($id);
    }

    // Notifications
    public function getUserNotifications(string $userId, int $perPage = 20)
    {
        return $this->contentRepository->getUserNotifications($userId, $perPage);
    }

    public function getUnreadCount(string $userId): int
    {
        return $this->contentRepository->getUnreadCount($userId);
    }

    public function markNotificationAsRead(string $id)
    {
        return $this->contentRepository->markAsRead($id);
    }

    public function markAllAsRead(string $userId): void
    {
        $this->contentRepository->markAllAsRead($userId);
    }

    public function createNotification(string $userId, string $title, string $message)
    {
        return $this->contentRepository->createNotification([
            'user_id' => $userId,
            'title' => $title,
            'message' => $message,
        ]);
    }
}

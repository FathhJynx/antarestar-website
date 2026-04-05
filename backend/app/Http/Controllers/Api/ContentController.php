<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\BaseController;
use App\Services\ContentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * @group Content & Notifications
 * 
 * Public articles and user notification management system.
 */
class ContentController extends BaseController
{
    protected ContentService $contentService;

    public function __construct(ContentService $contentService)
    {
        $this->contentService = $contentService;
    }

    // Articles
    public function articles(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        return $this->success($this->contentService->getPublishedArticles($perPage), 'Articles list.');
    }

    public function article(string $id): JsonResponse
    {
        $article = $this->contentService->getArticle($id);
        if (!$article) {
            return $this->error('Article not found.', 404);
        }
        return $this->success($article, 'Article detail.');
    }

    public function articleBySlug(string $slug): JsonResponse
    {
        $article = $this->contentService->getArticleBySlug($slug);
        if (!$article) {
            return $this->error('Article not found.', 404);
        }
        return $this->success($article, 'Article detail.');
    }

    public function createArticle(Request $request): JsonResponse
    {
        $data = $request->validate([
            'title' => 'required|string|max:200',
            'slug' => 'required|string|max:200|unique:articles,slug',
            'content' => 'required|string',
            'image_url' => 'nullable|string|max:255',
            'is_published' => 'nullable|boolean',
        ]);

        return $this->success($this->contentService->createArticle($data), 'Article created.', 201);
    }

    public function updateArticle(Request $request, string $id): JsonResponse
    {
        $data = $request->validate([
            'title' => 'sometimes|string|max:200',
            'slug' => 'sometimes|string|max:200',
            'content' => 'sometimes|string',
            'image_url' => 'nullable|string|max:255',
            'is_published' => 'nullable|boolean',
        ]);

        return $this->success($this->contentService->updateArticle($id, $data), 'Article updated.');
    }

    public function deleteArticle(string $id): JsonResponse
    {
        $this->contentService->deleteArticle($id);
        return $this->success(null, 'Article deleted.');
    }

    // Notifications
    public function notifications(Request $request): JsonResponse
    {
        $notifications = $this->contentService->getUserNotifications($request->user()->id);
        return $this->success($notifications, 'Notifications.');
    }

    public function unreadCount(Request $request): JsonResponse
    {
        $count = $this->contentService->getUnreadCount($request->user()->id);
        return $this->success(['unread_count' => $count], 'Unread notification count.');
    }

    public function markAsRead(string $id): JsonResponse
    {
        $notification = $this->contentService->markNotificationAsRead($id);
        return $this->success($notification, 'Notification marked as read.');
    }

    public function markAllAsRead(Request $request): JsonResponse
    {
        $this->contentService->markAllAsRead($request->user()->id);
        return $this->success(null, 'All notifications marked as read.');
    }
}

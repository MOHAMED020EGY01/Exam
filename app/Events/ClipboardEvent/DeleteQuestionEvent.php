<?php

namespace App\Events\ClipboardEvent;

use App\Enums\StatusHttp;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class DeleteQuestionEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
    private StatusHttp $status;
    private string $message;

    private int $userId;

    public function __construct(StatusHttp $status, string $message, int $userId)
    {
        $this->status = $status;
        $this->message = $message;
        $this->userId = $userId;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("users.{$this->userId}")
        ];
    }

    public function broadcastWith(): array
    {
        return [
            'status' => $this->status->value,
            'message' => $this->message,
        ];
    }

    public function broadcastAs(): string
    {
        return 'question.delete';
    }
}

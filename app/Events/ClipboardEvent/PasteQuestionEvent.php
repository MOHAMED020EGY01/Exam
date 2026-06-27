<?php

namespace App\Events\ClipboardEvent;

use App\Enums\StatusHttp;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class PasteQuestionEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;


    /**
     * Summary of __construct
     * @param StatusHttp $status
     * @param string $message
     * @param int $userId
     */
    public function __construct(
        private StatusHttp $status,
        private string $message,
        private int $userId
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel("users.{$this->userId}")
        ];
    }

    public function broadcastAs(): string
    {
        return 'question.paste';
    }

    public function broadcastWith(): array
    {
        return [
            'status' => $this->status->value,
            'message' => $this->message,
        ];
    }
}

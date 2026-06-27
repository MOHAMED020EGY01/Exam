<?php

namespace App\Events\ExamEvent;

use App\Models\Exam;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ExamDeleteEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        private array $exam,
        private int $userId
    ) {
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("users.{$this->userId}")
        ];
    }

    public function broadcastAs(): string
    {
        return 'exam.deleted';
    }

    // public function broadcastWith(): array
    // {
    //     return [
    //         'status' => $this->status->value,
    //         'message' => $this->message,
    //     ];
    // }
}

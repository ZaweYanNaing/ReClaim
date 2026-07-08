<?php

namespace App\Models;

use App\Enums\ReportStatus;
use App\Enums\ReportType;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * @property int $id
 * @property int $user_id
 * @property int $category_id
 * @property int $township_id
 * @property ReportType $type
 * @property ReportStatus $status
 * @property string $title
 * @property string $description
 * @property string|null $ward
 * @property string|null $photo
 * @property-read string|null $photo_url
 * @property Carbon|null $date_occurred
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property Carbon|null $deleted_at
 */
class Report extends Model
{
    /** @use HasFactory<\Database\Factories\ReportFactory> */
    use HasFactory, SoftDeletes;

    /**
     * @var list<string>
     */
    protected $appends = [
        'photo_url',
    ];

    /**
     * @var list<string>
     */
    protected $fillable = [
        'user_id',
        'category_id',
        'township_id',
        'type',
        'status',
        'title',
        'description',
        'ward',
        'photo',
        'date_occurred',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'type' => ReportType::class,
            'status' => ReportStatus::class,
            'date_occurred' => 'datetime',
        ];
    }

    /**
     * @return Attribute<string|null, never>
     */
    protected function photoUrl(): Attribute
    {
        return Attribute::get(function (): ?string {
            if ($this->photo === null) {
                return null;
            }

            if (str_starts_with($this->photo, 'http')) {
                return $this->photo;
            }

            return Storage::disk('public')->url($this->photo);
        });
    }

    /**
     * @return BelongsTo<User, $this>
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * @return BelongsTo<Category, $this>
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    /**
     * @return BelongsTo<Township, $this>
     */
    public function township(): BelongsTo
    {
        return $this->belongsTo(Township::class);
    }

    /**
     * @return HasMany<Claim, $this>
     */
    public function claims(): HasMany
    {
        return $this->hasMany(Claim::class);
    }

    /**
     * @return HasMany<Comment, $this>
     */
    public function comments(): HasMany
    {
        return $this->hasMany(Comment::class);
    }

    protected static function booted(): void
    {
        static::deleting(function (Report $report): void {
            if ($report->isForceDeleting()) {
                return;
            }

            $report->claims()->each(fn (Claim $claim): ?bool => $claim->delete());
        });
    }
}

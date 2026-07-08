<?php

namespace App\Http\Requests;

use App\Enums\ReportType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreReportRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user() !== null;
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'type' => ['required', Rule::enum(ReportType::class)],
            'title' => ['required', 'string', 'max:255'],
            'description' => ['required', 'string', 'max:5000'],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'township_id' => ['required', 'integer', 'exists:townships,id'],
            'ward' => ['nullable', 'string', 'max:255'],
            'date_occurred' => ['required', 'date', 'before_or_equal:today'],
            'photo' => ['nullable', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'type.required' => 'Please choose whether this is a lost or found item.',
            'title.required' => 'Please add a short title for your report.',
            'description.required' => 'Please describe the item so neighbors can help.',
            'category_id.required' => 'Please select a category.',
            'township_id.required' => 'Please select a township.',
            'date_occurred.required' => 'Please tell us when this happened.',
            'date_occurred.before_or_equal' => 'The date cannot be in the future.',
            'photo.image' => 'The photo must be an image file.',
            'photo.mimes' => 'Photos must be JPG, PNG, or WebP.',
            'photo.max' => 'Photos may not be larger than 5 MB.',
        ];
    }
}

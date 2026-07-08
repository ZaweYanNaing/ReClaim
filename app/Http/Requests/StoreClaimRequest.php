<?php

namespace App\Http\Requests;

use App\Enums\ClaimStatus;
use App\Enums\ReportStatus;
use App\Enums\ReportType;
use App\Models\Claim;
use App\Models\Report;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;

class StoreClaimRequest extends FormRequest
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
            'proof_description' => ['required', 'string', 'min:20', 'max:2000'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'proof_description.required' => 'Please describe how you can prove this item is yours.',
            'proof_description.min' => 'Please share a bit more detail so the finder can review your claim.',
            'proof_description.max' => 'Please keep your proof description under 2,000 characters.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $report = $this->route('report');

            if (! $report instanceof Report) {
                return;
            }

            if ($report->type !== ReportType::Found) {
                $validator->errors()->add('proof_description', 'Claims can only be submitted on found reports.');
            }

            if ($report->status === ReportStatus::Resolved) {
                $validator->errors()->add('proof_description', 'This report has already been resolved.');
            }

            if ($report->user_id === $this->user()?->id) {
                $validator->errors()->add('proof_description', 'You cannot claim your own report.');
            }

            $hasActiveClaim = Claim::query()
                ->where('report_id', $report->id)
                ->where('claimant_id', $this->user()?->id)
                ->whereIn('status', [ClaimStatus::Pending, ClaimStatus::Approved])
                ->exists();

            if ($hasActiveClaim) {
                $validator->errors()->add('proof_description', 'You already have an active claim on this report.');
            }
        });
    }
}

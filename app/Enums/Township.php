<?php

namespace App\Enums;

enum Township: string
{
    case Aungmyethazan = 'aungmyethazan';
    case Chanayethazan = 'chanayethazan';
    case Chanmyathazi = 'chanmyathazi';
    case MahaAungmye = 'maha_aungmye';
    case Pyigyidagun = 'pyigyidagun';
    case Amarapura = 'amarapura';
    case Patheingyi = 'patheingyi';

    public function label(): string
    {
        return match ($this) {
            self::Aungmyethazan => 'Aungmyethazan',
            self::Chanayethazan => 'Chanayethazan',
            self::Chanmyathazi => 'Chanmyathazi',
            self::MahaAungmye => 'Maha Aungmye',
            self::Pyigyidagun => 'Pyigyidagun',
            self::Amarapura => 'Amarapura',
            self::Patheingyi => 'Patheingyi',
        };
    }

    public function labelMm(): string
    {
        return match ($this) {
            self::Aungmyethazan => 'အင်းမြို့ဇန်',
            self::Chanayethazan => 'ချမ်းရွှေပြည်',
            self::Chanmyathazi => 'ချမ်းမြသာစည်',
            self::MahaAungmye => 'မဟာအောင်မြေ',
            self::Pyigyidagun => 'ပြည်ကြီးတံခွန်',
            self::Amarapura => 'အမရပူရ',
            self::Patheingyi => 'ပုသိမ်ကြီး',
        };
    }

    /**
     * @return array<string, string>
     */
    public static function options(): array
    {
        return collect(self::cases())
            ->mapWithKeys(fn (self $township): array => [$township->value => $township->label()])
            ->all();
    }
}

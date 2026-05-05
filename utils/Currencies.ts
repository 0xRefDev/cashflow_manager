'use client';
import React from 'react';

import { USD } from '@/icons/currencies/USD';
import { EUR } from '@/icons/currencies/EUR';
import { AUD } from '@/icons/currencies/AUD';
import { ARS } from '@/icons/currencies/ARS';
import { VES } from '@/icons/currencies/VES';
import { COP } from '@/icons/currencies/COP';
import { BRL } from '@/icons/currencies/BRL';
import { CLP } from '@/icons/currencies/CLP';
import { PEN } from '@/icons/currencies/PEN';
import { MXN } from '@/icons/currencies/MXN';
import { UYU } from '@/icons/currencies/UYU';
import { PYG } from '@/icons/currencies/PYG';
import { CRC } from '@/icons/currencies/CRC';
import { PAB } from '@/icons/currencies/PAB';
import { GBP } from '@/icons/currencies/GBP';
import { JPY } from '@/icons/currencies/JPY';
import { CNY } from '@/icons/currencies/CNY';
import { CAD } from '@/icons/currencies/CAD';
import { CHF } from '@/icons/currencies/CHF';
import { INR } from '@/icons/currencies/INR';
import { KRW } from '@/icons/currencies/KRW';
import { RUB } from '@/icons/currencies/RUB';


const CURRENCY_NAMES: Record<string, string> = {
  USD: 'US Dollar',
  EUR: 'Euro',
  VES: 'Bolívar Soberano',
  COP: 'Peso Colombiano',
  BRL: 'Real Brasileño',
  ARS: 'Peso Argentino',
  CLP: 'Peso Chileno',
  PEN: 'Sol Peruano',
  MXN: 'Peso Mexicano',
  UYU: 'Peso Uruguayo',
  PYG: 'Guaraní Paraguayo',
  CRC: 'Colón Costarricense',
  PAB: 'Balboa Panameño',
  GBP: 'Libra Esterlina',
  JPY: 'Yen Japonés',
  CNY: 'Yuan Chino',
  CAD: 'Dólar Canadiense',
  AUD: 'Dólar Australiano',
  CHF: 'Franco Suizo',
  INR: 'Rupia India',
  KRW: 'Won Coreano',
  RUB: 'Rublo Ruso',
};

const CURRENCY_ICONS: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>> | null> = {
  USD: USD,
  EUR: EUR,
  VES: VES,
  COP: COP,
  BRL: BRL,
  ARS: ARS,
  CLP: CLP,
  PEN: PEN,
  MXN: MXN,
  UYU: UYU,
  PYG: PYG,
  CRC: CRC,
  PAB: PAB,
  GBP: GBP,
  JPY: JPY,
  CNY: CNY,
  CAD: CAD,
  AUD: AUD,
  CHF: CHF,
  INR: INR,
  KRW: KRW,
  RUB: RUB,
};

export function getCurrencyIcon(code: string) {
  const normalizedCode = code?.toUpperCase();
  return CURRENCY_ICONS[normalizedCode] || null;
}

export function getCurrencyName(code: string) {
  const normalizedCode = code?.toUpperCase();
  return CURRENCY_NAMES[normalizedCode] || code;
}

export const CURRENCY_LIST = Object.keys(CURRENCY_ICONS);
import type { DocType } from '@/lib/documentsApi';
import { emptyPackingItem, type MoneyItem } from '@/utils/calc';

/** 영업 문서 흐름의 다음 단계. PL 은 체인의 끝이라 null. */
export const NEXT_TYPE: Record<DocType, DocType | null> = {
  QT: 'PO',
  PO: 'PI',
  PI: 'CI',
  CI: 'PL',
  PL: null,
};

type Dict = Record<string, string>;

function obj(payload: Record<string, unknown>, key: string): Dict {
  const v = payload[key];
  return v && typeof v === 'object' ? (v as Dict) : {};
}

function moneyItems(payload: Record<string, unknown>): MoneyItem[] {
  return Array.isArray(payload.items) ? (payload.items as MoneyItem[]) : [];
}

function qtToPo(p: Record<string, unknown>): Record<string, unknown> {
  const info = obj(p, 'info');
  return {
    shipTo: {
      company: info.company ?? '',
      address: info.address ?? '',
      contact: info.contact ?? '',
      paymentTerms: info.payment ?? '',
    },
    info: { currency: info.currency ?? '', remarks: info.remark ?? '' },
    items: moneyItems(p),
  };
}

function poToPi(p: Record<string, unknown>): Record<string, unknown> {
  const shipTo = obj(p, 'shipTo');
  return {
    info: {
      billCompany: shipTo.company ?? '',
      shipCompany: shipTo.company ?? '',
      billAddress: shipTo.address ?? '',
      shipAddress: shipTo.address ?? '',
      billContact: shipTo.contact ?? '',
      shipContact: shipTo.contact ?? '',
      payment: shipTo.paymentTerms ?? '',
      currency: obj(p, 'info').currency ?? '',
    },
    items: moneyItems(p),
  };
}

function piToCi(p: Record<string, unknown>): Record<string, unknown> {
  const info = obj(p, 'info');
  return {
    consignee: {
      company: info.shipCompany || info.billCompany || '',
      address: info.shipAddress || info.billAddress || '',
      phoneEmail: info.shipPhone || info.billPhone || '',
    },
    info: { payment: info.payment ?? '', currency: info.currency ?? '' },
    items: moneyItems(p),
  };
}

function ciToPl(p: Record<string, unknown>): Record<string, unknown> {
  const consignee = obj(p, 'consignee');
  const info = obj(p, 'info');
  const meta = obj(p, 'meta');
  return {
    consignee: {
      company: consignee.company ?? '',
      address: consignee.address ?? '',
      cityCountry: consignee.cityCountry ?? '',
      phone: consignee.phoneEmail ?? '',
    },
    info: {
      vessel: info.vessel ?? '',
      portLoading: info.portLoading ?? '',
      portDischarge: info.portDischarge ?? '',
      bl: info.bl ?? '',
    },
    meta: { refInvoiceNo: meta.invoiceNo ?? '' },
    items: moneyItems(p).map((m) => ({ ...emptyPackingItem(), desc: m.desc, pkgs: m.qty })),
  };
}

/**
 * 현재 문서 payload 를 다음 단계 문서의 부분 payload 로 변환.
 * 제공한 키만 채우고 문서번호·발행일 등 대상 자체 기본값은 보존한다.
 */
export function mapCarry(from: DocType, payload: Record<string, unknown>): Record<string, unknown> {
  switch (from) {
    case 'QT': return qtToPo(payload);
    case 'PO': return poToPi(payload);
    case 'PI': return piToCi(payload);
    case 'CI': return ciToPl(payload);
    default: return {};
  }
}

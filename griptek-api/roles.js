// 역할 정책 — 프론트 src/lib/roles.ts 의 ROLE_POLICY 와 수치 일치시킬 것.
// divisor: Unit Price = wh_price / divisor (천단위 절사)
// showCost/showMargin: 원가·마진 노출 → 둘 중 하나라도 true 면 원가 전송(needsCost)
const ROLE_POLICY = {
  super_admin: { divisor: 1 / 1.3, showCost: true,  showMargin: true,  canEdit: true  },
  staff:       { divisor: 1 / 1.25, showCost: true,  showMargin: true,  canEdit: false },
  distributor: { divisor: 0.70,    showCost: false, showMargin: false, canEdit: false },
  end_user:    { divisor: 0.70,    showCost: false, showMargin: false, canEdit: false },
};

function policyOf(role) {
  return ROLE_POLICY[role] || ROLE_POLICY.end_user;
}
function needsCost(pol) {
  return pol.showCost || pol.showMargin;
}

module.exports = { ROLE_POLICY, policyOf, needsCost };

# 팩트체크: industrial-accident-benefit (산재 휴업급여)

작성일: 2026-10-24

## 수치 검증

| 본문 수치 | 근거 | 출처 URL |
|---|---|---|
| 1일당 평균임금의 70% | 산업재해보상보험법 제52조 본문 | https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=575&menuType=cnpcls |
| 취업 불가 기간 3일 이내 미지급 | 산업재해보상보험법 제52조 단서 | https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=575&menuType=cnpcls |
| 소멸시효 3년 | 산업재해보상보험법 제112조 제1항 제1호 | https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=575&menuType=cnpcls |
| 지급 결정일부터 14일 이내 지급 | 산업재해보상보험법 제82조 제1항 | https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=575&menuType=cnpcls |
| 2026 최저보상기준 1일 82,560원 | 고용노동부고시 제2025-84호 | https://korea.legal/wiki/휴업급여-산정-특례와-부분휴업급여 (고시 원문 인용) |
| 저소득근로자 최저보상기준의 80% = 66,048원 | 82,560 × 80% = 66,048 (산업재해보상보험법 제54조) | https://korea.legal/wiki/휴업급여-산정-특례와-부분휴업급여 |
| 부분휴업급여 = (평균임금 - 취업일 임금) × 80% | 산업재해보상보험법 제53조 제1항 본문 | https://korea.legal/wiki/휴업급여-산정-특례와-부분휴업급여 |
| 고령자 감액: 61세 66/70, 62세 62/70 ... 65세 이후 50/70 | 산업재해보상보험법 제55조, 노동OK 산재보상 해설 | https://www.nodong.kr/sanjae/406578 |
| 61세 이후 취업 시 2년간 감액 미적용 | 산업재해보상보험법 제55조 제2항 | https://www.nodong.kr/sanjae/406578 |
| 부정수급 시 2배 징수 | 산업재해보상보험법 제84조 제1항 | https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=575&menuType=cnpcls |
| 비과세(공과금 미부과) | 산업재해보상보험법 제91조 | https://www.easylaw.go.kr/CSP/CnpClsMainBtr.laf?ccfNo=3&cciNo=1&cnpClsNo=1&csmSeq=575&menuType=cnpcls |
| 근로복지공단 전화 1588-0075 | 근로복지공단 홈페이지 대표번호 | https://www.comwel.or.kr |
| 출퇴근재해 인정(2018년~) | 산업재해보상보험법 제37조 제1항 제3호 | https://www.law.go.kr/법령/산업재해보상보험법 |

## 계산 검산

### 예시 1: 월급 300만 원
- 1일 평균임금 = 3,000,000 ÷ 30 = 100,000원 ✓
- 1일 휴업급여 = 100,000 × 0.70 = 70,000원 ✓
- 월 환산 = 70,000 × 30 = 2,100,000원 ✓
- 최저보상기준 비교: 70,000 > 66,048 → 원칙대로 70,000원 적용 ✓

### 예시 2: 월급 200만 원
- 1일 평균임금 = 2,000,000 ÷ 30 = 66,667원 (소수점 이하 절사) ✓
- 1일 휴업급여(원칙) = 66,667 × 0.70 = 46,667원 (소수점 절사) ✓
- 최저보상기준 80% = 82,560 × 0.80 = 66,048원 ✓
- 46,667 < 66,048 → 66,048원 적용 ✓
- 66,048 < 66,667(평균임금) → 66,048원 적용 확정 ✓
- 월 환산 = 66,048 × 30 = 1,981,440원 ✓

### 부분휴업급여 예시
- (100,000 - 40,000) × 0.80 = 48,000원 ✓

## 주의

- 평균임금 계산의 정확한 기준은 "재해 발생일 이전 3개월간 지급된 임금 총액 ÷ 총일수"이나, 본문에서는 이해를 돕기 위해 "월급 ÷ 30"으로 단순화하였음.
- 고령자 감액표는 "61세 이전에 취업하여 산재를 당한 후 61세에 도달한 경우"에 해당. 61세 이후에 취업한 경우의 감액 방식은 별도 규정(2년 유예 후 적용).

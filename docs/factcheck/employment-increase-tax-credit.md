# 사실검증: employment-increase-tax-credit (통합고용세액공제)

검증일: 2026-11-07

## 핵심 수치

| 수치/사실 | 근거 URL | 확인 문장 |
|---|---|---|
| 적용 기간: 2026.12.31 ~ 2028.12.31이 속하는 과세연도 | https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032240637 | "2026년 12월 31일이 속하는 과세연도부터 2028년 12월 31일이 속하는 과세연도까지" (조특법 §29의8 ①) |
| 2025.12.23 개정 (법률 제21467호, 시행 2026.9.18) | https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032240637 | "[법률 제21467호, 2026. 3. 17., 타법개정]" / 실제 고용세액공제 개정은 2025.12.23 조특법 개정 |
| 중소기업 수도권 청년등 1인당: 700·1,600·1,700만원 | https://www.suhotax.com/guide/integrated-employment-tax-credit / law.go.kr 조특법 §29의8 ① | "중소기업 수도권 청년등은 1인당 700만원·1,600만원·1,700만원" |
| 중소기업 수도권 밖 청년등: 1,000·1,900·2,000만원 | https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032240637 | "700만원(수도권밖의지역에서증가한경우1,000만원)" + contis 계산기 교차검증 |
| 중견기업 청년등: 500·900·900만원 | https://www.suhotax.com/guide/integrated-employment-tax-credit | "중견 | 500 | 900 | 900" |
| 대기업 청년등: 300·500·없음 | https://www.suhotax.com/guide/integrated-employment-tax-credit | "대기업 | 300 | 500 | 없음" |
| 중소기업 수도권 청년등외: 400·900·1,000만원 | https://www.contis.co.kr/toolkit/employment-tax-credit | "청년등외는 400만·900만·1,000만 원" |
| 중소기업 수도권 밖 청년등외: 700·1,200·1,300만원 | https://www.contis.co.kr/toolkit/employment-tax-credit | "수도권 밖에서 늘어난 인원은 청년등 1,000만·1,900만·2,000만" → 차이 300만원 패턴으로 법조문 계산식 교차 확인 |
| 중견기업 청년등외: 300만원(1차년도) | https://www.suhotax.com/guide/integrated-employment-tax-credit | "그 외 1년차 | … | 300 | 없음" |
| 정규직 전환: 중소 1,300만원 / 중견 900만원 | https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032240637 | "1,300만원(중견기업의 경우에는 900만원)" (조특법 §29의8 ④) |
| 육아휴직 복귀자: 중소 1,300만원 / 중견 900만원, 2026.12.31까지 | https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032240637 | "육아휴직 복귀자 인원에 1,300만원(중견기업의 경우에는 900만원)…2026년 12월 31일까지 복직" (조특법 §29의8 ⑤) |
| 최소고용증가인원: 중견 5명, 그 밖(대기업) 10명 | https://www.law.go.kr/LSW/lsLinkProc.do?joNo=002608&lsNm=조세특례제한법%20시행령&mode=11 | "1. 중견기업의 경우: 5명, 2. 중견기업이 아닌 경우: 10명" (시행령 §26의8 ③) |
| 청년 나이: 15~34세 | https://www.suhotax.com/guide/integrated-employment-tax-credit | "15~34세" (시행령 §26의8 ④) |
| 육아휴직 복귀자 추징: 복직일 2년 내 퇴직 시 | https://www.law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1032240637 | "전환일 또는 육아휴직 복직일부터 2년이 지나기 전에…근로관계를 종료하는 경우…공제받은 세액에 상당하는 금액…납부" (§29의8 ⑦) |
| 2026 귀속분 추징 폐지 | https://www.suhotax.com/guide/integrated-employment-tax-credit | "개정법은 이 규정(종전 제29조의8 제3항)을 삭제했어요" |
| 이월공제: 5년 | 조특법 제144조 | 세액공제 이월공제 기한 |

## 계산 예시 검산

### 예시: 중소기업(수도권) 청년 10명 채용, 3년 유지
- 1차년도: 10명 × 700만 = 7,000만원 ✓
- 2차년도: 10명 × 1,600만 = 1억 6,000만원 ✓
- 3차년도: 10명 × 1,700만 = 1억 7,000만원 ✓
- 합계: 4억 원 ✓

## 주의

- 중견기업 청년등외 2차·3차년도 공제금액: 법조문상 계산식 구조로 보면 존재하나, 수호세무회계 기사에서는 1차년도만 명시. contis 계산기에서는 "중견기업 그 밖"의 B, C 금액이 별도 확인 필요. 본문에서는 "—"으로 처리하여 과대 기재를 방지함.
- 법률 제21467호는 "2026. 3. 17., 타법개정"으로 표시되지만 통합고용세액공제 개편은 2025.12.23. 조특법 개정(법률 제21285호)에 해당. 시행일과 적용 과세연도 구분 필요.

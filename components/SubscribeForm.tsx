"use client";

import { useEffect } from "react";

// Stibee 임베드 구독 폼. 폼 검증·개인정보 동의·AJAX 제출은 Stibee 스크립트가 처리한다.
// 아래 폼 HTML은 Stibee가 발급한 임베드 코드를 그대로 사용한다(action URL·필드명·동의 모달 변경 금지).
const STIBEE_CSS = "https://resource.stibee.com/subscribe/stb_subscribe_form_style.css";
const STIBEE_JS = "https://resource.stibee.com/subscribe/stb_subscribe_form.js";

const STIBEE_FORM_HTML = `<div id="stb_subscribe">
  <form action="https://stibee.com/api/v1.0/lists/0GNODHMz0if-k0uvUE8Q6zw_alMCHg==/public/subscribers" method="POST" target="_blank" accept-charset="utf-8" class="stb_form" name="stb_subscribe_form" id="stb_subscribe_form" data-lang="" novalidate>
    <h1 class="stb_form_title">agenwiki 뉴스레터 구독하기</h1>
    <fieldset class="stb_form_set">
      <label for="stb_email" class="stb_form_set_label">
        이메일 주소<span class="stb_asterisk">*</span>
      </label>
      <input type="text" class="stb_form_set_input" id="stb_email" name="email" required="required">
      <div class="stb_form_msg_error" id="stb_email_error"></div>
    </fieldset>
    <div class="stb_form_policy">
      <label>
        <input type="checkbox" id="stb_policy" value="stb_policy_true">
        <span>(필수)</span>
        <button id="stb_form_modal_open" data-modal="stb_form_policy_modal" class="stb_form_modal_open_btn" type="button">개인정보 수집 및 이용</button>에 동의합니다.
      </label>
      <div class="stb_form_msg_error" id="stb_policy_error"></div>
      <div class="stb_form_modal stb_form_policy_text blind" id="stb_form_policy_modal">
        <div class="stb_form_modal_body">
          <h1 class="stb_form_modal_title">
            개인정보 수집 및 이용
          </h1>
          <div class="stb_form_modal_text">뉴스레터 발송을 위한 최소한의 개인정보를 수집하고 이용합니다.
수집된 정보는 발송 외 다른 목적으로 이용되지 않으며, 서비스가 종료되거나 구독을 해지할 경우 즉시 파기됩니다.</div>
          <div class="stb_form_modal_btn">
            <button id="stb_form_modal_close" class="stb_form_modal_close_btn" data-modal="stb_form_policy_modal" type="button">닫기</button>
          </div>
        </div>
        <div class="stb_form_modal_bg" id="stb_form_modal_bg"></div>
      </div>
    </div>
    <div class="stb_form_result" id="stb_form_result"></div>
    <fieldset class="stb_form_set_submit">
      <button type="submit" class="stb_form_submit_button" id="stb_form_submit_button" style="background-color: #FF6464; color: #ffffff;">구독하기</button>
    </fieldset>
  </form>
</div>`;

export function SubscribeForm() {
  useEffect(() => {
    // Stibee 폼 스타일(한 번만 삽입)
    if (!document.querySelector("link[data-stibee-css]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = STIBEE_CSS;
      link.setAttribute("data-stibee-css", "");
      document.head.appendChild(link);
    }
    // Stibee 폼 스크립트: 마운트될 때마다 새로 로드해 현재 폼을 초기화(클라이언트 네비게이션 대응)
    const script = document.createElement("script");
    script.src = STIBEE_JS;
    script.async = true;
    document.body.appendChild(script);
    return () => {
      script.remove();
    };
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: STIBEE_FORM_HTML }} />;
}

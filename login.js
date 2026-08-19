// login.js - Marcohard Ourlock disguise for AO3 login page
(function () {
  'use strict';

  if (new URLSearchParams(location.search).get('view') === 'raw') return;

  const cover = document.createElement('div');
  cover.id = 'outlook-cover';
  document.documentElement.appendChild(cover);

  function buildLoginShell() {
    const root = document.createElement('div');
    root.id = 'outlook-login';
    root.innerHTML = `
      <style>
        #outlook-login {
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483646 !important;
          display: flex;
          flex-direction: column;
          background: #f3f2f1;
          font-family: 'Segoe UI', 'Noto Sans SC', 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
          color: #323130;
        }
        #outlook-login .login-header {
          display: flex;
          align-items: center;
          height: 48px;
          background: #0078d4;
          padding: 0 16px;
        }
        #outlook-login .login-header .logo-text {
          color: #fff;
          font-size: 14px;
          font-weight: 600;
          letter-spacing: 0.5px;
        }
        #outlook-login .login-header .logo-icon {
          width: 20px;
          height: 20px;
          background: #fff;
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-right: 8px;
        }
        #outlook-login .login-header .logo-icon span {
          color: #0078d4;
          font-size: 11px;
          font-weight: 700;
        }
        #outlook-login .login-body {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f3f2f1;
        }
        #outlook-login .login-card {
          width: 400px;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.12);
          padding: 40px;
        }
        #outlook-login .login-card h2 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 8px;
          color: #323130;
        }
        #outlook-login .login-card .subtitle {
          font-size: 13px;
          color: #605e5c;
          margin-bottom: 28px;
        }
        #outlook-login .form-group {
          margin-bottom: 20px;
        }
        #outlook-login .form-group label {
          display: block;
          font-size: 13px;
          font-weight: 500;
          color: #323130;
          margin-bottom: 6px;
        }
        #outlook-login .form-group input[type="text"],
        #outlook-login .form-group input[type="password"] {
          width: 100%;
          height: 36px;
          padding: 0 12px;
          border: 1px solid #edebe9;
          border-radius: 4px;
          font-size: 14px;
          color: #323130;
          outline: none;
          transition: border-color 0.15s;
          box-sizing: border-box;
        }
        #outlook-login .form-group input:focus {
          border-color: #0078d4;
          box-shadow: 0 0 0 1px #0078d4;
        }
        #outlook-login .remember-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 24px;
        }
        #outlook-login .remember-row input[type="checkbox"] {
          width: 16px;
          height: 16px;
          accent-color: #0078d4;
        }
        #outlook-login .remember-row label {
          font-size: 13px;
          color: #323130;
          cursor: pointer;
        }
        #outlook-login .btn-submit {
          width: 100%;
          height: 40px;
          background: #0078d4;
          color: #fff;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.15s;
        }
        #outlook-login .btn-submit:hover {
          background: #106ebe;
        }
        #outlook-login .links {
          margin-top: 20px;
          font-size: 13px;
          color: #605e5c;
          line-height: 1.8;
        }
        #outlook-login .links a {
          color: #0078d4;
          text-decoration: none;
        }
        #outlook-login .links a:hover {
          text-decoration: underline;
        }
        #outlook-login .back-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-top: 16px;
          font-size: 13px;
          color: #0078d4;
          text-decoration: none;
          cursor: pointer;
        }
        #outlook-login .back-link:hover {
          text-decoration: underline;
        }
      </style>
      <div class="login-header">
        <div class="logo-icon"><span>M</span></div>
        <span class="logo-text">Marcohard Ourlock</span>
      </div>
      <div class="login-body">
        <div class="login-card">
          <h2>登录</h2>
          <p class="subtitle">使用你的 Marcohard Ourlock 帐户</p>
          <form id="outlook-login-form" action="https://archiveofourown.org/users/login" method="post">
            <input type="hidden" name="authenticity_token" id="csrf-token">
            <div class="form-group">
              <label for="login-email">电子邮件地址或用户名</label>
              <input type="text" id="login-email" name="user[login]" autocomplete="username" required>
            </div>
            <div class="form-group">
              <label for="login-password">密码</label>
              <input type="password" id="login-password" name="user[password]" autocomplete="current-password" required>
            </div>
            <div class="remember-row">
              <input type="checkbox" id="remember-me" name="user[remember_me]" value="1" checked>
              <label for="remember-me">记住我</label>
            </div>
            <input type="hidden" name="user[remember_me]" value="0">
            <button type="submit" class="btn-submit">登录</button>
          </form>
          <div class="links">
            <a href="https://archiveofourown.org/users/password/new">忘记密码？</a><br>
            <a href="https://archiveofourown.org/invite_requests">需要邀请码？</a>
          </div>
          <a class="back-link" href="javascript:history.back()">← 返回</a>
        </div>
      </div>
    `;
    return root;
  }

  function boot() {
    // Get CSRF token from original page
    const csrfMeta = document.querySelector('meta[name="csrf-token"]');
    const csrfToken = csrfMeta ? csrfMeta.getAttribute('content') : '';

    const root = buildLoginShell();
    document.body.appendChild(root);
    document.body.style.overflow = 'hidden';

    // Set CSRF token
    const csrfInput = root.querySelector('#csrf-token');
    if (csrfInput) csrfInput.value = csrfToken;

    document.title = 'Marcohard Ourlock - 登录';

    if (cover.parentNode) cover.parentNode.removeChild(cover);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();

/* eslint-disable no-undef */
import func from './showUserData';

describe('testing framePrepare function', () => {
  document.body.innerHTML = `
    <header>
      <div class="content-wrapper">
        <h1>Piskel-clone</h1>
        <div class="auth-block">
          <button class="log-in" hidden>Log in&nbsp;<i class="fas fa-sign-in-alt"></i></button>
        </div>
      </div>
    </header>
`;

  let result;
  beforeEach(() => {
    result = func('John', 'http');
  });

  it('should return "HTMLButtonElement"', () => {
    expect(result).toBeInstanceOf(HTMLButtonElement);
  });
});

import MobileDetect from 'mobile-detect';

export function isMobile() {
    const md=new MobileDetect(window.navigator.userAgent);
    return md.mobile();
}

export function windowSize() {
    return [window.innerWidth, window.innerHeight];
}
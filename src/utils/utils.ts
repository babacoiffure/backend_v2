export function generateOTP(length: number) {
    let otp = "";
    let possible = "0123456789";

    for (let i = 0; i < length; i++) {
        otp += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return otp;
}

export const generateRandomNumber = (digit: number) => {
    let randomNum = "";
    let possible = "0123456789";

    for (let i = 0; i < digit; i++) {
        randomNum += possible.charAt(
            Math.floor(Math.random() * possible.length)
        );
    }
    return Number(randomNum);
};

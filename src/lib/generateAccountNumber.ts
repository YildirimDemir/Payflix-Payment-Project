export const generateAccountNumber = (): string => {
    const randomPart1 = Math.floor(1000 + Math.random() * 9000); 
    const randomPart2 = Math.floor(1000 + Math.random() * 9000); 
    return `PYX-${randomPart1}-${randomPart2}`;
};  
export function calculateConfidence({ accuracy, tokenAge, distanceJump }: any) {
    let confidence = 100

    if (accuracy > 100) confidence -= 30
    if (distanceJump) confidence -= 50
    if (tokenAge > 40) confidence -= 20

    return confidence
}
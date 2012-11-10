function thresolded(n) {
    if (n > -0.005 && n < 0.005) {
        return 0;
    } else {
        return n;
    }
}

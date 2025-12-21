export type PositionView = {
    positionId: number;
    coin: string;
    expectationLabel: string;
    entry: string;
    openedAt: string;
    target: string;
    statusLabel: string;
};

export type CreatorCard = {
    address: string;
    username: string;
    avatar: string;
    monthlyPriceWei: bigint;
    activeProfile: boolean;
    subscribed: boolean;
    isOwnCard: boolean;
    expiresAt?: number;
    isBusy?: boolean;
    isMinimized?: boolean;
    activeSubscribers?: number;
    positions: PositionView[];
};

// Text the tests assert on, copied verbatim with its source path, so a copy change is fixed here, not in specs.
//   UI text: ../client/src/i18n/en.json and ../client/src/i18n/vi.json (key in the comment)
// Duck Stack has no backend, so there is no server message table.

export const copy = {
  app: {
    title: "Duck Stack", // app.title
  },
  hud: {
    score: "Score", // hud.score
    lines: "Lines", // hud.lines
    level: "Level", // hud.level
    time: "Time", // hud.time
    pps: "PPS", // hud.pps
    b2b: "Back-to-back", // hud.b2b
    combo: "Combo", // hud.combo
    hold: "Hold", // hud.hold
    next: "Next", // hud.next
  },
  action: {
    pause: "Pause", // action.pause
    resume: "Resume", // action.resume
    restart: "Restart", // action.restart
    settings: "Settings", // action.settings
    playAgain: "Play again", // action.playAgain
    highScores: "High scores", // action.highScores
    language: "Language", // action.language
    close: "Close", // action.close
    left: "Move left", // action.left
    right: "Move right", // action.right
    softDrop: "Soft drop", // action.softDrop
    hardDrop: "Hard drop", // action.hardDrop
    rotCW: "Rotate right", // action.rotCW
    rotCCW: "Rotate left", // action.rotCCW
    hold: "Hold piece", // action.hold
  },
  modal: {
    paused: "Paused", // modal.paused
    gameOver: "Game over", // modal.gameOver
    blockOut: "The stack reached the top.", // modal.blockOut
  },
  hint: {
    move: "Move", // hint.move
    softDrop: "Soft drop", // hint.softDrop
    hardDrop: "Hard drop", // hint.hardDrop
    rotate: "Rotate", // hint.rotate
    hold: "Hold", // hint.hold
    pause: "Pause", // hint.pause
  },
  board: {
    label: "Playfield, 10 columns by 20 rows", // board.label with {cols}=10 {rows}=20
  },
  settings: {
    close: "Close settings", // settings.close
    done: "Done", // settings.done
    reset: "Reset to defaults", // settings.reset
    easy: "Easy", // settings.difficulty.easy
    normal: "Normal", // settings.difficulty.normal
    hard: "Hard", // settings.difficulty.hard
    custom: "Custom", // settings.difficulty.custom
    fallSpeed: "Fall speed", // settings.fallSpeed
    fallSpeedHint: (n: string) => `${n} cells per second`, // settings.fallSpeedHint
    dasHint: (n: number, ms: number) => `${n} ticks before auto-repeat (${ms} ms)`, // settings.dasHint
    arrHint: (n: number, ms: number) => `${n} ticks between repeats (${ms} ms)`, // settings.arrHint
    rebind: (action: string) => `Rebind ${action}`, // settings.rebind
    pressKey: "Press a key…", // settings.pressKey
    alreadyBound: (binding: string) => `That key is already ${binding}`, // settings.alreadyBound
    ghost: "Landing hint", // settings.ghost
    colorBlind: "Distinguish without colour", // settings.colorBlind
    smoothHorizontal: "Smooth sideways motion", // settings.smoothHorizontal
    sound: "Sound effects", // settings.sound
    volume: "Volume", // settings.volume
    storageUnavailable:
      "This browser will not let the game save settings, so they last until you close the tab.", // settings.storageUnavailable
    storageRecovered: "Saved settings could not be read in full and were restored where possible.", // settings.storageRecovered
  },
  scores: {
    localOnly:
      "Kept on this device only, in this browser. Clearing browsing data erases them, and nothing is sent anywhere.", // scores.localOnly
    empty: "No rounds saved at this difficulty yet.", // scores.empty
    customCaveat:
      "Each custom round ran at its own speed, shown per row — these are not comparable with one another.", // scores.customCaveat
    nickname: "Display name", // scores.nickname
    anon: "Player", // scores.anon
    clear: "Clear this board", // scores.clear
    clearConfirm: "Clear — cannot be undone", // scores.clearConfirm
    clearWarning: "This permanently deletes every score on this board. Press again to confirm.", // scores.clearWarning
    close: "Close high scores", // scores.close
    board: "Board", // scores.board
    listLabel: (n: string) => `High scores, ${n}`, // scores.listLabel
    linesN: (n: string) => `${n} lines`, // scores.linesN
    speedN: (n: string) => `${n} cells/s`, // scores.speedN
    storageUnavailable: "Scores cannot be saved: this browser is blocking storage, or it is full.", // scores.storageUnavailable
    storageRecovered: "Some saved data could not be read and was repaired. A record may be missing.", // scores.storageRecovered
  },
  account: {
    signIn: "Sign in", // account.signIn
    menu: "Ducker ID account", // account.menu
    openProfile: "Open Ducker ID profile", // account.openProfile
    signOut: "Sign out", // account.signOut
  },
  vi: {
    hudScore: "Điểm", // vi.json hud.score
    pause: "Tạm dừng", // vi.json action.pause
    settings: "Cài đặt", // vi.json action.settings
    paused: "Đang tạm dừng", // vi.json modal.paused
    gameOver: "Kết thúc", // vi.json modal.gameOver
    resume: "Chơi tiếp", // vi.json action.resume
    hudLines: "Số hàng", // vi.json hud.lines
    highScores: "Điểm cao", // vi.json action.highScores
    language: "Ngôn ngữ", // vi.json action.language
  },
} as const;

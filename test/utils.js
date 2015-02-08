import * as W from "../src/world"
import * as S from "../src/systems"
import * as C from "../src/components"
import * as E from "../src/entities"

export function timeout(duration = 0) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, duration);
  });
}

export class TestCounterComponent extends C.Component {
  static defaults() {
    return { counter: 0, timeElapsed: 0 };
  }
}
C.register('TestCounterComponent', TestCounterComponent);

export class TestCounterSystem extends S.System {
  constructor() {
    this.initialized = false;
    this.drawCounter = 0;
    this.drawTimeElapsed = 0;
  }
  initialize() {
    this.initialized = true;
  }
  matchComponent() {
    return TestCounterComponent.name;
  }
  updateComponent(timeDelta, entityId, testComponent) {
    testComponent.counter++;
    testComponent.timeElapsed += timeDelta;
  }
  draw(timeDelta) {
    this.drawCounter++;
    this.drawTimeElapsed += timeDelta;
  }
}
S.register('TestCounterSystem', TestCounterSystem);

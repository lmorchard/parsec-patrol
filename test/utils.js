import * as W from "../src/world"
import * as S from "../src/systems"
import * as C from "../src/components"
import * as E from "../src/entities"

export class TestCounterComponent extends C.Component {
  static defaults() {
    return { counter: 0, timeElapsed: 0 };
  }
}
// TODO: Need a component registry
C.TestCounterComponent = TestCounterComponent;

export class TestCounterSystem extends S.System {
  constructor() {
    this.drawCounter = 0;
    this.drawTimeElapsed = 0;
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

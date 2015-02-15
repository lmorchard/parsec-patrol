import * as Core from "../core";

export class ClickCourse extends Core.Component {
  static defaults() {
    return { x: 0, y: 0, stopOnArrival: false, active: true };
  }
}

Core.registerComponent('ClickCourse', ClickCourse);

export class ClickCourseSystem extends Core.System {

  matchComponent() { return 'ClickCourse'; }

  initialize() {
    this.trackingCursor = false;
    this.world
      .subscribe('mouseDown', (msg, x, y) => {
        this.trackingCursor = true;
      })
      .subscribe('mouseUp', (msg, x, y) => {
        this.trackingCursor = false;
        this.setCourse(x, y);
      })
      .subscribe('mouseMove', (msg, x, y) => {
        if (this.trackingCursor) { this.setCourse(x, y); }
      });
  }

  setCourse(x, y) {
    var clickCourses = this.world.entities.get('ClickCourse');
    for (var entityId in clickCourses) {
      var clickCourse = clickCourses[entityId];
      clickCourse.active = true;
      clickCourse.x = x;
      clickCourse.y = y;
    }
  }

  updateComponent(timeDelta, entityId, clickCourse) {

    var entities = this.world.entities;
    var position = entities.get('Position', entityId);
    var seeker = entities.get('Seeker', entityId);
    var thruster = entities.get('Thruster', entityId);
    var sprite = entities.get('Sprite', entityId);

    if (clickCourse.active) {
      thruster.active = true;
      thruster.stop = false;
      seeker.targetPosition = { x: clickCourse.x, y: clickCourse.y };
    }

    var xOffset = Math.abs(position.x - clickCourse.x);
    var yOffset = Math.abs(position.y - clickCourse.y);
    if (xOffset < sprite.size && yOffset < sprite.size) {
      if (clickCourse.stopOnArrival) {
        thruster.stop = true;
      }
    }

  }

}

Core.registerSystem('ClickCourse', ClickCourseSystem);

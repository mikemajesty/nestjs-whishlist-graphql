import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';

import { IEventAdapter } from './adapter';
import { EventNameEnum } from './types';

@Injectable()
export class EventService implements IEventAdapter {
  constructor(private eventEmitter: EventEmitter2) {}

  emit(event: EventNameEnum, payload: object): EmitEventOutput {
    const eventEmitter = this.eventEmitter.emit(event.toString(), payload);

    return eventEmitter;
  }
}

export type EmitEventInput<T> = T;
export type EmitEventOutput = boolean;

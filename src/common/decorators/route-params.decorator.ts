import { Param, ParseIntPipe } from '@nestjs/common';

/**
 * Parses the :id param of the request as an int
 */
export const EntityId = Param('id', ParseIntPipe);

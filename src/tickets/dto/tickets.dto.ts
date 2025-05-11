import { ApiProperty } from '@nestjs/swagger';
import { IsDefined, IsEnum, IsNotEmpty } from 'class-validator';
import { TicketStatus } from '../tickets.entity';

export class CreateTicketDto {
  @ApiProperty({ example: 1 })
  @IsDefined()
  @IsNotEmpty()
  assetId: number;

  @ApiProperty({ example: 'Issue description' })
  @IsDefined()
  @IsNotEmpty()
  issueDescription: string;

  @ApiProperty({
    enum: TicketStatus,
  })
  @IsEnum(TicketStatus)
  @IsDefined()
  status: TicketStatus;
}

export class updateTicketDto {
  @ApiProperty({
    enum: TicketStatus,
  })
  @IsEnum(TicketStatus)
  @IsDefined()
  status: TicketStatus;
}

export class TicketResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 200 })
  status: number;

  @ApiProperty({ example: 'Ticket modified successfully' })
  message: string;
}

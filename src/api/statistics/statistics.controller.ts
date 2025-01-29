import { Controller, Get, HttpStatus } from "@nestjs/common";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { StatisticsService } from "./statistics.service";

@ApiTags('Statistics')
@Controller('statistics')
export class StatisticsController {
    debtService: any;
    constructor(private readonly statisticsService: StatisticsService) {}

    @ApiOperation({
        summary: 'Get total debt',
        description: 'total amount of debt from all records.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved total debt.',
        schema: {
          example: {
            status_code: HttpStatus.OK,
            message: 'success',
            data: 1000.50,
          },
        },
    })

    @ApiOperation({
        summary: 'Get all active deptors',
        description: 'list of all active debtors.'
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieved active debtors.',
        schema: {
            example: {
                status_code: HttpStatus.OK,
                message: 'success',
                data: [
                    {
                        id: 'uuid1',
                        full_name: 'Test Testov',
                        phone_number: '+998941205726',
                        image: 'image_url.jpg',
                        address: 'Street Name, City',
                        note: 'Good deptor',
                        is_active: true,
                    }
                ]
            }
        }
    })
    

    @Get('totalDept')
    async getTotalDept(): Promise<number> {
        return this.statisticsService.calculateTotalDept()
    }
    @Get('activeDeptors')
    async getActiveDeptors() {
        return this.statisticsService.getActiveDeptors()
    }


}
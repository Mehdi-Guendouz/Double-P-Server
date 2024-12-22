import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserToken } from 'src/auth/types/userTokenType';
import { History } from 'src/history/schema/history.schema';
import { UsersService } from 'src/users/user.service';
import { NumberParfaitDto, PalindromeDto } from './dto/check.palindrome.dto';
import { Action_Type } from 'src/history/enums/enum.action';

@Injectable()
export class FunctionalitiesService {
  constructor(
    @InjectModel(History.name) private historyModel: Model<History>,
    private usersService: UsersService,
  ) {}

  //   for the user to get the history of his transactions
  async getAllHistory(user: UserToken) {
    const history = await this.historyModel
      .find({ user: user.id })
      .populate('user');
    // we check for the history of the user if its not found we throw an error
    if (!history) {
      throw new NotFoundException('No history found');
    }

    return {
      status: 'success',
      data: history,
    };
  }

  //   the palindrome function
  async isPalindrome(user: Types.ObjectId, input: PalindromeDto) {
    // we reverse the word and compare it with the original word
    const reversedWord = input.word.split('').reverse().join('');
    const historyDetails = {
      user: user.id,
      word: input.word,
      description: input.description,
      actionType: Action_Type.Palindrome,
    };

    // checking if the two words are equal or not
    // creating the history
    if (reversedWord === input.word) {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: true,
      });
      // return the result
      return {
        status: 'success',
        message: 'The word is a palindrome',
        data: history,
      };
    } else {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: false,
      });
      // return the result
      return {
        status: 'success',
        message: 'The word is not a palindrome',
        data: history,
      };
    }
  }

  //   i didint link this since the result will be the same

  async isPalindromeUsingAnotherMethod(
    user: Types.ObjectId,
    input: PalindromeDto,
  ) {
    const historyDetails = {
      user: user.id,
      word: input.word,
      description: input.description,
      actionType: Action_Type.Palindrome,
    };
    // reverse the array using a for loop
    let reversedWord = '';
    for (let i = input.word.length - 1; i >= 0; i--) {
      reversedWord += input.word[i];
    }

    if (reversedWord === input.word) {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: true,
      });
      return {
        status: 'success',
        message: 'The word is a palindrome',
        data: history,
      };
    } else {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: false,
      });
      return {
        status: 'success',
        message: 'The word is not a palindrome',
        data: history,
      };
    }
  }

  //   the perfect number function
  async isPerfectNumber(user: Types.ObjectId, input: NumberParfaitDto) {
    // we check if the number is a perfect number
    let somme = 0;
    // we use number / 2 instead of the number itself to minimize the number of iterations because its impossible to have a divisor greater than the number itself
    // we do math floor to get the integer value of the number
    for (let i = 1; i <= Math.floor(input.number / 2); i++) {
      if (input.number % i === 0) {
        somme += i;
      }
    }
    const historyDetails = {
      user: user.id,
      number: input.number,
      description: input.description,
      actionType: Action_Type.NumberParfait,
    };

    // if the somme of the divisors is equal to the number
    // then the number is a perfect number
    if (somme === input.number) {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: true,
      });
      return {
        status: 'success',
        message: 'The number is a perfect number',
        data: history,
      };
    } else {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: false,
      });
      return {
        status: 'success',
        message: 'The number is not a perfect number',
        data: history,
      };
    }
  }

  //   this function gives you the nearest perfect number of a giving number

  async nearestPerfectNumber(user: Types.ObjectId, input: NumberParfaitDto) {
    // we check if the number is a perfect number so we don't have to find the nearest perfect number because its already a perfect number
    const isPerfect = await this.checkIfNumberIsPerfect(input.number);
    const historyDetails = {
      user: user.id,
      number: input.number,
      description: input.description,
      actionType: Action_Type.NearestParfait,
    };

    // if the somme of the divisors is equal to the number
    // then the number is a perfect number
    if (isPerfect) {
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: true,
        nearestPerfectNumber: input.number,
      });
      return {
        status: 'success',
        message: 'The number is a perfect number',
        data: history,
      };
    } else {
      // if the number is not a perfect number
      // we find the nearest perfect number
      //   we do the same thing with the perfect number but just we do it for all the numbers to find the nearest
      let nearestPerfectNumber = 0;
      for (let i = input.number - 1; i > 0; i--) {
        if (await this.checkIfNumberIsPerfect(i)) {
          if (i > nearestPerfectNumber) {
            nearestPerfectNumber = i;
          } else {
            break;
          }
        }
      }
      const history = await this.historyModel.create({
        ...historyDetails,
        isValid: false,
        nearestPerfectNumber: nearestPerfectNumber,
      });
      return {
        status: 'success',
        message: 'The nearest perfect number is found',
        data: history,
      };
    }
  }

  //   delete history
  async deleteHistory(user: UserToken, id: string) {
    // we check if the history exists
    const history = await this.historyModel.findOne({ _id: id, user: user.id });
    if (!history) {
      throw new NotFoundException('No history found');
    }
    // we delete the history
    await this.historyModel.deleteOne({ _id: id });
    return {
      status: 'success',
      message: 'History deleted',
    };
  }

  //   in this case i used a private function to check because i find out that i will use this function 2 times in the same service
  private async checkIfNumberIsPerfect(number: number): Promise<boolean> {
    let somme = 0;
    // we use number / 2 instead of the number itself to minimize the number of iterations because its impossible to have a divisor greater than the number itself
    // we do math floor to get the integer value of the number
    for (let i = 1; i <= Math.floor(number / 2); i++) {
      if (number % i === 0) {
        somme += i;
      }
    }
    return somme === number;
  }
}

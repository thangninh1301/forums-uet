import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'friendFilter'
})
export class FriendFilterPipe implements PipeTransform {

  /**
   * search user
   * @param friends 
   * @param searchFriend 
   */
  transform(friends: any[], searchFriend: string): any[] {
    if (!friends || !searchFriend) {
      return friends;
    }
    return friends.filter(friend => friend.fullName.toLocaleLowerCase().indexOf(searchFriend.toLocaleLowerCase()) !== -1);
  }

}

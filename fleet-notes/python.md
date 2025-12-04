---
tags:
  - cheat-sheet
  - python
id: 20251201211225
created: 2025-12-01
reviewed: false
status:
  - in_progress
type: fleet-note
---

## **Variable Conventions**
* Lower case.
* Underscore style.
* `_` Protected variable.
* `__` Private variable.
## **Code CheatSheet**

```python
# This is a sample Python script.  
  
# Press ⌃R to execute it or replace it with your code.  
# Press Double ⇧ to search everywhere for classes, files, tool windows, actions, and settings.  
  
  
def print_hi(name):  
    # Use a breakpoint in the code line below to debug your script.  
    print(f'Hi, {name}')  # Press ⌘F8 to toggle the breakpoint.  
  
  
  
# Press the green button in the gutter to run the script.  
if __name__ == '__main__':  
    # print_hi('PyCharm')  
    # print('Hello World')    # print(0b100)    # print(0o100)    # print(100)    # print(0x100)    # name = 'ryan'    # print(f'Hello {name}')    # float_number = 3.14    # print(f'{float_number = :.1f}') # fucking crazy    # print(f'{float_number:.1f}')    #    # # if else    # height = float(input('Height(cm)：'))  
    # weight = float(input('Weight(kg)：'))  
    # bmi = weight / (height / 100) ** 2    # print(f'{bmi = :.1f}')    # if 18.5 <= bmi < 24:    #     print('Good!')    # else:    #     print('Bad!')    #    #    # status_code = int(input('Status code: '))    # match status_code:    #     case 400 | 405:    #         description = 'Invalid Request'    #     case 401 | 403 | 404:    #         description = 'Not Allowed'    #     case 418:    #         description = 'I am a teapot'    #     case 429:    #         description = 'Too many requests'    #     case _:    #         description = 'Unknown Status Code'    # print('Description:', description)    #    # # for in    # total = 0    # # range(start, end, step)    # for i in range(2, 101, 2):    #     total += i    # print(total)    #    # # while    # total = 0    # i = 1    # while i <= 100:    #     total += i    #     i += 1    # print(total)    #    # # list    # list1 = [1, 2, 3]    # print(list1)    # list2 = list(range(2, 10))    # print(list2)    # list3 = list1 + list2    # print(list3)    # print(list1 * 3)    # print(1 in list1)    # print(10 in list1)  
    # list index    list1 = list(range(1,21))  
    print(list1)  
    print(list1[0])  
    print(list1[-1])  
    # [start:end:stride]  
    print(list1[1:10:2])  
  
    for e in list1:  
        print(e)  
  
    # generate  
    items = [i+1 for i in range(1, 100) if i % 3 == 0 or i % 5 == 0]  
    print(items)  
  
    nums1 = [35, 12, 97, 64, 55]  
    nums2 = [num for num in nums1 if num > 50]  
    print(nums2)  
  
    #tuple  
    t1 = (35, 12, 98)  
    a = 1, 10, 100  
    i, j, k = a  
  
    #set  
    set1 = {1, 2, 3, 3, 3, 2}  
    print(set1)  
  
    set1 = {1, 2, 3, 4, 5, 6, 7}  
    set2 = {2, 4, 6, 8, 10}  
  
    # 交集  
    print(set1 & set2)  # {2, 4, 6}  
    print(set1.intersection(set2))  # {2, 4, 6}  
  
    # 并集  
    print(set1 | set2)  # {1, 2, 3, 4, 5, 6, 7, 8, 10}  
    print(set1.union(set2))  # {1, 2, 3, 4, 5, 6, 7, 8, 10}  
  
    # 差集  
    print(set1 - set2)  # {1, 3, 5, 7}  
    print(set1.difference(set2))  # {1, 3, 5, 7}  
  
    # 对称差  
    print(set1 ^ set2)  # {1, 3, 5, 7, 8, 10}  
    print(set1.symmetric_difference(set2))  # {1, 3, 5, 7, 8, 10}  
  
    #dict    xinhua = {  
        '麓': '山脚下',  
        '路': '道，往来通行的地方；方面，地区：南～货，外～货；种类：他俩是一～人',  
        '蕗': '甘草的别名',  
        '潞': '潞水，水名，即今山西省的浊漳河；潞江，水名，即云南省的怒江'  
    }  
    print(xinhua)  
    person = {  
        'name': '王大锤',  
        'age': 55,  
        'height': 168,  
        'weight': 60,  
        'addr': '成都市武侯区科华北路62号1栋101',  
        'tel': '13122334455',  
        'emergence contact': '13800998877'  
    }  
    print(person)  
  
    # dict函数(构造器)中的每一组参数就是字典中的一组键值对  
    person = dict(name='王大锤', age=55, height=168, weight=60, addr='成都市武侯区科华北路62号1栋101')  
    print(person)  # {'name': '王大锤', 'age': 55, 'height': 168, 'weight': 60, 'addr': '成都市武侯区科华北路62号1栋101'}  
  
    # 用字典生成式语法创建字典  
    items3 = {x: x ** 3 for x in range(1, 6)}  
    print(items3)  # {1: 1, 2: 8, 3: 27, 4: 64, 5: 125}  
  
# See PyCharm help at https://www.jetbrains.com/help/pycharm/

```

# References

# Link to
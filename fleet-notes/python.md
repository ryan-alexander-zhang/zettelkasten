---
tags:
  - cheat-sheet
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
    print_hi('PyCharm')
    print('Hello World')
    print(0b100)
    print(0o100)
    print(100)
    print(0x100)
    name = 'ryan'
    print(f'Hello {name}')
    float_number = 3.14
    print(f'{float_number = :.1f}') # fucking crazy
    print(f'{float_number:.1f}')

    # if else
    height = float(input('Height(cm)：'))
    weight = float(input('Weight(kg)：'))
    bmi = weight / (height / 100) ** 2
    print(f'{bmi = :.1f}')
    if 18.5 <= bmi < 24:
        print('Good!')
    else:
        print('Bad!')


    status_code = int(input('Status code: '))
    match status_code:
        case 400 | 405:
            description = 'Invalid Request'
        case 401 | 403 | 404:
            description = 'Not Allowed'
        case 418:
            description = 'I am a teapot'
        case 429:
            description = 'Too many requests'
        case _:
            description = 'Unknown Status Code'
    print('Description:', description)

    # for in
    total = 0
    # range(start, end, step)
    for i in range(2, 101, 2):
        total += i
    print(total)

    # while
    total = 0
    i = 1
    while i <= 100:
        total += i
        i += 1
    print(total)


# See PyCharm help at https://www.jetbrains.com/help/pycharm/

```

# References

# Link to
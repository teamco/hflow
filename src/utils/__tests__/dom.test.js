import React from 'react';
import { render } from '@testing-library/react';

import {
  focusAt,
  htmlToElement,
  htmlToElements,
  observeDOM
} from '@/utils/dom';

describe('htmlToElement_function', () => {
  test('test_validHtml', () => {
    const html = '<div>Hello World</div>';
    const result = htmlToElement(html);
    expect(result.tagName).toBe('DIV');
    expect(result.textContent).toBe('Hello World');
  });

  test('test_validHtmlWithWhitespace', () => {
    const html = '   <div>Hello World</div>   ';
    const result = htmlToElement(html);
    expect(result.tagName).toBe('DIV');
    expect(result.textContent).toBe('Hello World');
  });

  test('test_emptyString', () => {
    const html = '';
    const result = htmlToElement(html);
    expect(result).toBeNull();
  });

  test('test_whitespaceString', () => {
    const html = '   ';
    const result = htmlToElement(html);
    expect(result).toBeNull();
  });

  test('test_nestedHtml', () => {
    const html = '<div><p>Hello World</p></div>';
    const result = htmlToElement(html);
    expect(result.tagName).toBe('DIV');
    expect(result.firstChild.tagName).toBe('P');
    expect(result.firstChild.textContent).toBe('Hello World');
  });
});

describe('htmlToElements_function', () => {
  test('test_validInput', () => {
    const html = '<div>test</div>';
    const result = htmlToElements(html);
    expect(result.length).toBe(1);
    expect(result[0].tagName).toBe('DIV');
    expect(result[0].textContent).toBe('test');
  });

  test('test_multipleElements', () => {
    const html = '<div>test1</div><div>test2</div>';
    const result = htmlToElements(html);
    expect(result.length).toBe(2);
    expect(result[0].tagName).toBe('DIV');
    expect(result[0].textContent).toBe('test1');
    expect(result[1].tagName).toBe('DIV');
    expect(result[1].textContent).toBe('test2');
  });

  test('test_emptyInput', () => {
    const html = '';
    const result = htmlToElements(html);
    expect(result.length).toBe(0);
  });

  test('test_whitespaceInput', () => {
    const html = '   ';
    const result = htmlToElements(html);
    expect(result.length).toBe(0);
  });

  test('test_textNodes', () => {
    const html = '<div>test1</div>text<div>test2</div>';
    const result = htmlToElements(html);
    expect(result.length).toBe(3);
    expect(result[0].tagName).toBe('DIV');
    expect(result[0].textContent).toBe('test1');
    expect(result[1].nodeName).toBe('#text');
    expect(result[1].textContent).toBe('text');
    expect(result[2].tagName).toBe('DIV');
    expect(result[2].textContent).toBe('test2');
  });
});

describe('observeDOM_function', () => {
  test('test_cssClassNotFound', () => {
    // call the observeDOM function with a non-existent css class
    const callback = jest.fn();
    observeDOM('non-existent-class', {}, callback);

    // add an element without the css class to the DOM
    const element = document.createElement('div');
    document.body.appendChild(element);

    // expect the callback function to not have been called
    expect(callback).not.toHaveBeenCalled();
  });
});

describe('focusAt_function', () => {

  beforeEach(() => {
    jest.spyOn(React, 'useEffect').mockImplementationOnce(cb => cb()());
  });

  // Tests that function does not throw an error when condition is true and ref is undefined.
  it('test_focus_at_with_true_condition_and_undefined_ref', () => {
    expect(() => {
      focusAt({ condition: true });
    }).not.toThrow();
  });

  // Tests that function does not throw an error when condition is false and ref is undefined.
  it('test_focus_at_with_false_condition_and_undefined_ref', () => {
    expect(() => {
      focusAt({ condition: false });
    }).not.toThrow();
  });

  // Tests that function does not throw an error when ref is defined but does not have a current property.
  it('test_focus_at_with_defined_ref_without_current_property', () => {
    const ref = {};
    expect(() => {
      focusAt({ condition: true, ref });
    }).not.toThrow();
  });

  // Tests that function does not throw an error when ref is not a valid object.
  it('test_focus_at_with_invalid_ref', () => {
    expect(() => {
      focusAt({ condition: true, ref: 'invalidRef' });
    }).not.toThrow();
  });
});
